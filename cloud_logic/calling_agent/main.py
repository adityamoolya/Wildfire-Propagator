import os
import httpx
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Connect
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
ULTRAVOX_API_KEY = os.getenv("ULTRAVOX_API_KEY")
HOST_DOMAIN = os.getenv("HOST_DOMAIN")

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

SYSTEM_PROMPT = """
You are an automated emergency response AI for a wildfire propagation system.
A high-risk wildfire has been detected near the user's location.
Keep your responses extremely concise, calm, and actionable.
Provide evacuation guidance if asked. Prioritize human safety.
Respond in 1-3 sentences max.
"""

ULTRAVOX_API_URL = "https://api.ultravox.ai/api/calls"


async def create_ultravox_call(system_prompt: str) -> str:
    """Create an Ultravox call session and return the joinUrl (WebSocket URL for Twilio)."""
    payload = {
        "systemPrompt": system_prompt,
        "model": "fixie-ai/ultravox-70B",
        "voice": "Mark",
        "temperature": 0.7,
        "medium": {"twilio": {}}  # tells Ultravox this is a Twilio call
    }
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            ULTRAVOX_API_URL,
            json=payload,
            headers={
                "X-API-Key": ULTRAVOX_API_KEY,
                "Content-Type": "application/json"
            }
        )
        resp.raise_for_status()
        data = resp.json()
        return data["joinUrl"]  # this is the WebSocket URL Twilio streams audio to


@app.post("/trigger-call")
async def trigger_call(phone_number: str, context: str = None):
    """Initiate an outbound call. Optionally override system prompt via context param."""
    prompt = context if context else SYSTEM_PROMPT

    # 1. Create Ultravox session first, get the joinUrl
    join_url = await create_ultravox_call(prompt)
    print(f"Ultravox joinUrl: {join_url}")

    # 2. Store joinUrl temporarily (keyed by a token in the twiml URL)
    # For simplicity we pass it as a query param to /twiml
    import urllib.parse
    encoded_url = urllib.parse.quote(join_url, safe="")

    # 3. Make the Twilio call, pointing to /twiml with the joinUrl embedded
    call = twilio_client.calls.create(
        to=phone_number,
        from_=TWILIO_PHONE_NUMBER,
        url=f"https://{HOST_DOMAIN}/twiml?join_url={encoded_url}"
    )
    return {"status": "Call initiated", "call_sid": call.sid}


@app.post("/twiml")
async def generate_twiml(request: Request):
    """Twilio hits this when the user picks up. Connects them to Ultravox stream."""
    params = dict(request.query_params)
    join_url = params.get("join_url", "")

    response = VoiceResponse()
    connect = Connect()
    connect.stream(url=join_url)  # point directly at Ultravox's WebSocket
    response.append(connect)

    return HTMLResponse(content=str(response), media_type="application/xml")