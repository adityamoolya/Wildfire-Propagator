#  SpreadCast

**AI-powered wildfire detection, propagation prediction, and automated emergency response.**

SpreadCast connects a mesh of ESP32 sensor nodes to a cloud pipeline that detects fire in real-time, predicts its spread path using live weather data, and automatically calls people in the danger zone via AI voice agents.

---

## Architecture Overview

```
ESP32 Sensors ──► RandomForest (Lambda) ──► PropagationCalc (EC2) ──► calling_agent (EC2)
                        │                        │                          │
                   Classifies fire          Predicts spread           Calls affected
                   from sensor data         using weather API         people via Twilio
                                                 │                     + Ultravox AI
                                                 ▼
                                           Dashboard (Frontend)
```

### Data Flow

1. **ESP32 node** sends sensor readings + its `node_id` to the RandomForest endpoint
2. **RandomForest** classifies fire probability. If `fire_confirmed == true`, forwards data to PropagationCalc
3. **PropagationCalc** looks up the origin node's lat/lon from the shared node registry, fetches live wind/humidity from Open-Meteo, and runs an elliptical fire spread model
4. **PropagationCalc** determines which downstream nodes are threatened and their estimated time-to-impact (ETA), then triggers the calling_agent for each
5. **calling_agent** initiates Twilio calls with Ultravox AI voice, providing per-caller context (ETA, evacuation direction, dashboard URL)
6. **Dashboard** (frontend) receives the predicted fire polygon via API and renders it on a live map

---

## Cloud Logic Services

### `cloud_logic/RandomForestModel/` — Fire Detection

| Detail | Value |
|---|---|
| **Runtime** | Python (FastAPI + Mangum) |
| **Deployment Target** | AWS Lambda |
| **Model** | scikit-learn RandomForest (`rf_fire_model.pkl`, ~3.8 MB) |
| **Endpoint** | `POST /predict` |

**Input (SensorPayload):**
```json
{
  "node_id": 5,
  "temperature": 78.2,
  "humidity": 12.0,
  "tvoc": 890,
  "eco2": 1200,
  "pm25": 185.0
}
```

**Output:**
```json
{
  "fire_probability": 0.91,
  "fire_confirmed": true,
  "origin_node_id": 5,
  "sensor_readings": { "temperature": 78.2, "humidity": 12.0, "tvoc": 890, "eco2": 1200, "pm25": 185.0 }
}
```

When `fire_confirmed == true`, the Lambda forwards the full payload to PropagationCalc.

---

### `cloud_logic/PropagationCalc/` — Fire Spread Prediction

| Detail | Value |
|---|---|
| **Runtime** | Python (FastAPI) |
| **Deployment Target** | EC2 |
| **Weather API** | Open-Meteo (free, no key required) |
| **Endpoint** | `POST /propagate` |

**Responsibilities:**
- Maintains ESP32 node registry: `node_id → (lat, lon, phone, label)`
- Fetches real-time weather (wind speed, wind direction, humidity) from Open-Meteo
- Runs wind-driven elliptical fire spread model from origin node
- Determines which nodes fall within the predicted fire path
- Returns ordered list of threatened nodes with ETAs
- Triggers calling_agent for each threatened node
- Exposes fire polygon data for the frontend dashboard

**Input:**
```json
{
  "origin_node_id": 5,
  "fire_probability": 0.91,
  "sensor_readings": { "temperature": 78.2, "humidity": 12.0, "tvoc": 890, "eco2": 1200, "pm25": 185.0 }
}
```

**Output:**
```json
{
  "incident_id": "INC-20260516-233001",
  "origin": { "node_id": 5, "lat": 17.3862, "lon": 78.4880 },
  "weather": { "wind_speed_kmh": 15, "wind_direction_deg": 315, "humidity_pct": 18 },
  "threatened_nodes": [
    { "node_id": 3, "eta_minutes": 8,  "label": "Sector A - North Gate" },
    { "node_id": 7, "eta_minutes": 15, "label": "Sector C - Hilltop" },
    { "node_id": 12, "eta_minutes": 42, "label": "Sector D - Reservoir" }
  ]
}
```

---

### `cloud_logic/calling_agent/` — Emergency Voice Alerts

| Detail | Value |
|---|---|
| **Runtime** | Python (FastAPI) |
| **Deployment Target** | EC2 |
| **Voice AI** | Ultravox (70B model via Twilio media stream) |
| **Telephony** | Twilio |
| **Tunnel** | Cloudflare Tunnel (for Twilio webhook reachability) |
| **Endpoints** | `POST /trigger-call`, `POST /twiml` |

**How it works:**
1. Receives a call request with phone number and per-caller context from PropagationCalc
2. Creates an Ultravox AI voice session with context-specific system prompt (fire location, ETA, evacuation direction)
3. Initiates outbound Twilio call pointing to the `/twiml` webhook
4. When the callee picks up, Twilio streams audio to Ultravox via WebSocket
5. The AI agent provides calm, concise evacuation guidance and directs the user to the dashboard

**Environment Variables (`.env`):**
```
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
ULTRAVOX_API_KEY=...
HOST_DOMAIN=...          # Cloudflare tunnel domain
```

---

### `cloud_logic/shared/` — Shared Configuration *(planned)*

**`node_registry.json`** — Single source of truth for all ESP32 node metadata:
```json
{
  "nodes": {
    "1":  { "lat": 17.3850, "lon": 78.4867, "phone": "+91XXXXXXXXXX", "label": "Sector A - North Gate" },
    "5":  { "lat": 17.3862, "lon": 78.4880, "phone": "+91XXXXXXXXXX", "label": "Sector B - Valley" },
    "7":  { "lat": 17.3870, "lon": 78.4890, "phone": "+91XXXXXXXXXX", "label": "Sector C - Hilltop" }
  }
}
```

Used by both PropagationCalc (for geospatial calculations) and calling_agent (for phone numbers).

---

## Local Development

```bash
# RandomForest
cd cloud_logic/RandomForestModel
pip install -r requirements.txt
uvicorn handler:app --reload --port 8001

# PropagationCalc
cd cloud_logic/PropagationCalc
pip install -r requirements.txt
uvicorn main:app --reload --port 8002

# calling_agent
cd cloud_logic/calling_agent
pip install -r requirements.txt
uvicorn main:app --reload --port 8003

# Expose calling_agent via Cloudflare Tunnel (for Twilio webhooks)
cloudflared tunnel --url http://localhost:8003
```

---

## Frontend

See `frontend/` directory. Built with React + TypeScript + Vite. Maintained separately.
