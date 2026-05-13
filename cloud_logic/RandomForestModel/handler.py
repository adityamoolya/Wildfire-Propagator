from fastapi import FastAPI
from mangum import Mangum
import joblib, numpy as np
from pydantic import BaseModel

app = FastAPI()
model = joblib.load("rf_fire_model.pkl")

class SensorPayload(BaseModel):
    temperature: float
    humidity: float
    tvoc: float
    eco2: float
    pm25: float

@app.post("/predict")
def predict(payload: SensorPayload):
    X = np.array([[
        payload.temperature,
        payload.humidity,
        payload.tvoc,
        payload.eco2,
        payload.pm25
    ]])
    prob = model.predict_proba(X)[0][1]
    fire = bool(prob > 0.65)  # cast to native python bool
    return {
        "fire_probability": round(float(prob), 4),  # cast to native python float
        "fire_confirmed": fire
    }

handler = Mangum(app)