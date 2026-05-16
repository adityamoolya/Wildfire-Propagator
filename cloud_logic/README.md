# Cloud Logic

Backend services for SpreadCast fire detection and response pipeline.

## Quick Start (Docker Compose)

### Prerequisites

- Docker & Docker Compose installed
- Cloudflare Tunnel (`cloudflared`) installed
- Twilio & Ultravox credentials filled in `calling_agent/.env`
- Real phone numbers filled in `shared/node_registry.json`

### Step 1: Start the Cloudflare Tunnel

The calling agent needs a public URL so Twilio can hit its `/twiml` webhook when
someone picks up the phone. Start the tunnel **first**:

```bash
cloudflared tunnel --url http://localhost:8003
```

This prints a public URL like `https://xxx-xxx-xxx.trycloudflare.com`.
Copy it and update `calling_agent/.env`:

```
HOST_DOMAIN=xxx-xxx-xxx.trycloudflare.com
```

> **Keep this terminal open** — the tunnel must stay running.

### Step 2: Spin up all services

In a new terminal:

```bash
cd cloud_logic
docker compose up --build
```

This starts three containers:

| Container | Service | Port | Purpose |
|---|---|---|---|
| `spreadcast-rf` | RandomForest | 8001 | Fire detection from sensor data |
| `spreadcast-prop` | PropagationCalc | 8002 | Fire spread prediction + call orchestration |
| `spreadcast-agent` | calling_agent | 8003 | Twilio + Ultravox emergency voice calls |

Wait until you see all three show `Uvicorn running on ...` in the logs.

### Step 3: Test it

Send a fake fire reading to the RandomForest:

```bash
curl -X POST http://localhost:8001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "node_id": 5,
    "temperature": 20.0,
    "humidity": 55.0,
    "tvoc": 1000,
    "eco2": 400,
    "pm25": 2.0
  }'
```

If the model returns `fire_confirmed: true`, you'll see PropagationCalc fetch weather,
calculate spread, and trigger calls in the docker logs.

Check PropagationCalc health:

```bash
curl http://localhost:8002/health
```

### Step 4: Shut down

```bash
docker compose down
```

---

## Running Without Docker

If you prefer running services directly:

```bash
# Terminal 1 — Cloudflare Tunnel
cloudflared tunnel --url http://localhost:8003

# Terminal 2 — calling_agent
cd calling_agent
pip install -r requirements.txt
uvicorn main:app --reload --port 8003

# Terminal 3 — PropagationCalc
cd PropagationCalc
uv sync
uv run uvicorn main:app --reload --port 8002

# Terminal 4 — RandomForest
cd RandomForestModel
pip install -r requirements.txt
uvicorn handler:app --reload --port 8001
```

---

## Services

### RandomForestModel (Port 8001)
Fire detection classifier. Receives ESP32 sensor data, runs inference through a
pre-trained Random Forest model, and forwards confirmed fire events to PropagationCalc.

- **Endpoint**: `POST /predict`
- **Input**: `node_id`, `temperature`, `humidity`, `tvoc`, `eco2`, `pm25`
- **Cooldown**: 10-minute per-node cooldown to prevent duplicate triggers

### PropagationCalc (Port 8002)
Fire spread prediction. Receives confirmed fire events, fetches live weather from
Open-Meteo, runs a wind-driven elliptical spread model, determines which ESP32 nodes
are threatened (with ETAs), and triggers the calling agent for each.

- **Endpoint**: `POST /propagate`
- **Health**: `GET /health`
- **Weather**: Open-Meteo (free, no API key). Falls back to defaults if unreachable.
- **Logs**: All incidents logged to `events.jsonl`

### calling_agent (Port 8003)
Emergency voice alert system. Initiates outbound phone calls via Twilio with an
Ultravox AI voice agent that provides callers with evacuation guidance.

- **Endpoint**: `POST /trigger-call?phone_number=...&context=...`
- **Webhook**: `POST /twiml` (hit by Twilio when callee picks up)
- **Tunnel**: Requires Cloudflare Tunnel for Twilio webhook reachability

### shared/
Contains `node_registry.json` — the single source of truth mapping ESP32 node IDs
to lat/lon coordinates, phone numbers, and human-readable labels.

## Data Flow

```
ESP32 → POST /predict (8001) → fire? → POST /propagate (8002) → POST /trigger-call (8003)
                                              ↓
                                        Open-Meteo API
```

## Event Logging

PropagationCalc writes all incident events to `events.jsonl` (one JSON object per line).
This file is gitignored.
