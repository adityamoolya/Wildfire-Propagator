import audioop

def twilio_to_gemini(mulaw_chunk: bytes) -> bytes:
    """Converts 8kHz mulaw from Twilio to 16kHz PCM for Gemini."""
    # Convert mu-law to 16-bit PCM
    pcm_8k = audioop.ulaw2lin(mulaw_chunk, 2)
    # Resample from 8kHz to 16kHz
    pcm_16k, _ = audioop.ratecv(pcm_8k, 2, 1, 8000, 16000, None)
    return pcm_16k

def gemini_to_twilio(pcm_16k_chunk: bytes) -> bytes:
    """Converts 16kHz PCM from Gemini to 8kHz mulaw for Twilio."""
    # Resample from 16kHz to 8kHz
    pcm_8k, _ = audioop.ratecv(pcm_16k_chunk, 2, 1, 16000, 8000, None)
    # Convert 16-bit PCM to mu-law
    mulaw = audioop.lin2ulaw(pcm_8k, 2)
    return mulaw