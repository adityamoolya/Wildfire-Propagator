import os
import json
import asyncio
import websockets
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

async def test_gemini_connection():
    # The updated v1beta URL
    url = f"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key={GEMINI_API_KEY}"
    
    print("Attempting to connect to Gemini Live API (v1beta)...")
    
    try:
        async with websockets.connect(url) as ws:
            print("Connected! Sending setup payload...")
            
            # 1. Send the exact setup payload we use in main.py
            setup_msg = {
                "setup": {
                    "model": "models/gemini-2.5-flash", # <-- Use the standard 2.5 Flash model
                    "systemInstruction": {"parts": [{"text": "You are a test assistant. Keep it extremely brief."}]}
                }
            }
            await ws.send(json.dumps(setup_msg))
            
            # Wait a tiny bit for the setup to process
            await asyncio.sleep(1)
            
            print("Setup sent. Sending a test text message...")
            
            # 2. Send a text message (simulating the user speaking)
            text_msg = {
                "clientContent": {
                    "turns": [{
                        "role": "user",
                        "parts": [{"text": "Hello! If you receive this, please reply with 'Connection is successful'."}]
                    }],
                    "turnComplete": True
                }
            }
            await ws.send(json.dumps(text_msg))
            
            print("Message sent. Waiting for response...\n")
            
            # 3. Listen for the response
            while True:
                response = await ws.recv()
                data = json.loads(response)
                
                # Check if it's the expected server content
                if "serverContent" in data:
                    model_turn = data["serverContent"].get("modelTurn")
                    if model_turn:
                        for part in model_turn["parts"]:
                            if "text" in part:
                                print(f"Gemini Text Response: {part['text']}")
                            elif "inlineData" in part:
                                print("Gemini Audio Response Received! (Raw bytes omitted for terminal)")
                
                # If Gemini says the turn is complete, we can exit
                if data.get("serverContent", {}).get("turnComplete"):
                    print("\nTest finished successfully.")
                    break
                    
    except websockets.exceptions.ConnectionClosedError as e:
        print(f"\nConnection Closed Error! Code: {e.code}, Reason: {e.reason}")
        print("If you see '1008 policy violation', the model name or API version is still incorrect.")
    except Exception as e:
        print(f"\nAn error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(test_gemini_connection())