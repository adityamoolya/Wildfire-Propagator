import os
import logging
from fastapi import FastAPI, BackgroundTasks
from mangum import Mangum
import joblib, numpy as np
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rf_handler")

app = FastAPI()
model = joblib.load("rf_fire_model.pkl")

PROPAGATION_CALC_URL = os.getenv("PROPAGATION_CALC_URL", "http://localhost:8002")

# Cooldown tracker: node_id -> last fire timestamp
_fire_cooldowns: dict[int, float] = {}
COOLDOWN_SECONDS = 600  # 10-minute cooldown per node


class SensorPayload(BaseModel):
    node_id: int
    temperature: float
    humidity: float
    tvoc: float
    eco2: float
    pm25: float


def _forward_to_propagation(payload: dict):
    """Fire-and-forget POST to PropagationCalc. Runs as a background task."""
    try:
        resp = httpx.post(
            f"{PROPAGATION_CALC_URL}/propagate",
            json=payload,
            timeout=30.0,
        )
        resp.raise_for_status()
        logger.info("PropagationCalc responded: %s", resp.json())
    except httpx.HTTPError as e:
        logger.error("Failed to reach PropagationCalc: %s", e)


@app.post("/predict")
def predict(payload: SensorPayload, background_tasks: BackgroundTasks):
    import time

    X = np.array([[
        payload.temperature,
        payload.humidity,
        payload.tvoc,
        payload.eco2,
        payload.pm25,
    ]])
    prob = model.predict_proba(X)[0][1]
    fire = bool(prob > 0.65)

    result = {
        "fire_probability": round(float(prob), 4),
        "fire_confirmed": fire,
        "origin_node_id": payload.node_id,
        "sensor_readings": {
            "temperature": payload.temperature,
            "humidity": payload.humidity,
            "tvoc": payload.tvoc,
            "eco2": payload.eco2,
            "pm25": payload.pm25,
        },
    }

    if fire:
        now = time.time()
        last = _fire_cooldowns.get(payload.node_id, 0)
        if now - last > COOLDOWN_SECONDS:
            _fire_cooldowns[payload.node_id] = now
            logger.info(
                "🔥 Fire confirmed at node %d (prob=%.4f). Forwarding to PropagationCalc.",
                payload.node_id, prob,
            )
            background_tasks.add_task(_forward_to_propagation, result)
        else:
            remaining = int(COOLDOWN_SECONDS - (now - last))
            logger.info(
                "🔥 Fire at node %d suppressed (cooldown, %ds remaining).",
                payload.node_id, remaining,
            )

    return result


handler = Mangum(app)