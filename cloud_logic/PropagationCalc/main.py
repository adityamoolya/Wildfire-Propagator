"""
PropagationCalc — Fire spread prediction service.

Takes a confirmed fire event from the RandomForest Lambda, fetches live weather,
runs a wind-driven elliptical spread model, identifies threatened ESP32 nodes,
and triggers the calling_agent for each with per-caller context.
"""

import os
import json
import math
import logging
import datetime
import urllib.parse
from pathlib import Path
from typing import Optional

import httpx
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("propagation")

app = FastAPI(title="SpreadCast PropagationCalc")

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
CALLING_AGENT_URL = os.getenv("CALLING_AGENT_URL", "http://localhost:8003")
REGISTRY_PATH = Path(os.getenv(
    "NODE_REGISTRY_PATH",
    str(Path(__file__).resolve().parent.parent / "shared" / "node_registry.json"),
))
LOG_FILE = Path(os.getenv("LOG_FILE", "events.jsonl"))

# Open-Meteo (free, no API key)
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

# Fire spread model defaults (used when weather API fails)
DEFAULT_WIND_SPEED = 10.0   # km/h
DEFAULT_WIND_DIR = 0.0      # degrees (north)
DEFAULT_HUMIDITY = 40.0     # percent


# ---------------------------------------------------------------------------
# Node Registry
# ---------------------------------------------------------------------------
def load_registry() -> dict:
    """Load the ESP32 node registry from JSON."""
    with open(REGISTRY_PATH, "r") as f:
        data = json.load(f)
    return data["nodes"]


NODE_REGISTRY = load_registry()


# ---------------------------------------------------------------------------
# Pydantic Models
# ---------------------------------------------------------------------------
class SensorReadings(BaseModel):
    temperature: float
    humidity: float
    tvoc: float
    eco2: float
    pm25: float


class FireEvent(BaseModel):
    fire_probability: float
    fire_confirmed: bool
    origin_node_id: int
    sensor_readings: SensorReadings


class ThreatenedNode(BaseModel):
    node_id: str
    lat: float
    lon: float
    label: str
    distance_m: float
    eta_minutes: float
    phone: str


class PropagationResult(BaseModel):
    incident_id: str
    origin: dict
    weather: dict
    threatened_nodes: list[ThreatenedNode]
    call_results: list[dict]


# ---------------------------------------------------------------------------
# Geo Helpers
# ---------------------------------------------------------------------------
def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Distance in meters between two lat/lon points."""
    R = 6_371_000  # Earth radius in meters
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def bearing_deg(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Initial bearing (degrees, 0=N, 90=E) from point 1 to point 2."""
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dl = math.radians(lon2 - lon1)
    y = math.sin(dl) * math.cos(p2)
    x = math.cos(p1) * math.sin(p2) - math.sin(p1) * math.cos(p2) * math.cos(dl)
    return (math.degrees(math.atan2(y, x)) + 360) % 360


def opposite_bearing(bearing: float) -> float:
    """Given wind_from direction, return the direction wind is blowing toward."""
    return (bearing + 180) % 360


# ---------------------------------------------------------------------------
# Weather
# ---------------------------------------------------------------------------
async def fetch_weather(lat: float, lon: float) -> dict:
    """
    Fetch current weather from Open-Meteo.
    Returns wind_speed (km/h), wind_direction (degrees the wind blows FROM),
    and relative humidity (%).
    Falls back to defaults on failure.
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,wind_speed_10m,wind_direction_10m,relative_humidity_2m",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(OPEN_METEO_URL, params=params)
            resp.raise_for_status()
            data = resp.json()["current"]
            weather = {
                "wind_speed_kmh": data["wind_speed_10m"],
                "wind_direction_from_deg": data["wind_direction_10m"],
                "humidity_pct": data["relative_humidity_2m"],
                "temperature_c": data["temperature_2m"],
                "source": "open-meteo",
            }
            logger.info("Weather fetched: %s", weather)
            return weather
    except Exception as e:
        logger.warning("Weather API failed (%s), using defaults.", e)
        return {
            "wind_speed_kmh": DEFAULT_WIND_SPEED,
            "wind_direction_from_deg": DEFAULT_WIND_DIR,
            "humidity_pct": DEFAULT_HUMIDITY,
            "temperature_c": None,
            "source": "fallback-defaults",
        }


# ---------------------------------------------------------------------------
# Fire Spread Model  (wind-driven elliptical approximation)
# ---------------------------------------------------------------------------
def compute_rate_of_spread(wind_speed_kmh: float, humidity_pct: float) -> dict:
    """
    Returns head fire and back fire rate of spread (m/min)
    using a simplified wind-driven elliptical model.
    """
    # Base ROS in m/min (moderate grassland/scrub fuel)
    base_ros = 3.0  # m/min

    # Humidity factor: drier → faster spread (linear interpolation)
    # At 0% humidity → factor 1.5, at 100% → factor 0.3
    humidity_factor = max(0.3, 1.5 - humidity_pct / 100.0)

    # Wind factor: head fire accelerated by wind
    wind_factor = 1.0 + 0.05 * wind_speed_kmh

    head_ros = base_ros * humidity_factor * wind_factor  # m/min downwind

    # Length-to-breadth ratio (Anderson 1983 approximation)
    lb_ratio = max(1.0, 1.0 + 0.25 * wind_speed_kmh)

    back_ros = head_ros / lb_ratio  # m/min upwind

    return {
        "head_ros_m_per_min": round(head_ros, 2),
        "back_ros_m_per_min": round(back_ros, 2),
        "lb_ratio": round(lb_ratio, 2),
    }


def estimate_eta(
    distance_m: float,
    node_bearing: float,
    wind_toward_deg: float,
    head_ros: float,
    back_ros: float,
) -> float:
    """
    Estimate time (minutes) for fire to reach a point at given distance and
    bearing from origin, given the wind direction.

    Uses cosine interpolation between head fire (downwind) and back fire (upwind).
    """
    # Angle between wind direction and bearing to node
    angle_diff = abs(node_bearing - wind_toward_deg)
    if angle_diff > 180:
        angle_diff = 360 - angle_diff

    # Cosine interpolation: 0° (downwind) → head_ros, 180° (upwind) → back_ros
    cos_factor = (1 + math.cos(math.radians(angle_diff))) / 2  # 1.0 downwind, 0.0 upwind
    effective_ros = back_ros + (head_ros - back_ros) * cos_factor

    if effective_ros <= 0.01:
        return float("inf")

    return distance_m / effective_ros  # minutes


# ---------------------------------------------------------------------------
# Evacuation Direction
# ---------------------------------------------------------------------------
def suggest_evacuation_direction(wind_toward_deg: float) -> str:
    """Suggest evacuation perpendicular to and away from wind direction."""
    # Evacuate perpendicular to the wind, away from fire
    evac_bearing = (wind_toward_deg + 90) % 360
    directions = [
        (0, "North"), (45, "Northeast"), (90, "East"), (135, "Southeast"),
        (180, "South"), (225, "Southwest"), (270, "West"), (315, "Northwest"),
    ]
    closest = min(directions, key=lambda d: abs(d[0] - evac_bearing) if abs(d[0] - evac_bearing) <= 180 else 360 - abs(d[0] - evac_bearing))
    return closest[1]


# ---------------------------------------------------------------------------
# Call Triggering
# ---------------------------------------------------------------------------
async def trigger_call_for_node(
    node: ThreatenedNode,
    origin_label: str,
    weather: dict,
    evacuation_dir: str,
) -> dict:
    """Call the calling_agent's /trigger-call endpoint for one threatened node."""

    context = (
        f"EMERGENCY: A wildfire has been detected at {origin_label}. "
        f"Current wind: {weather['wind_speed_kmh']} km/h. "
        f"Based on fire spread prediction, the fire is estimated to reach "
        f"your area ({node.label}) in approximately {round(node.eta_minutes)} minutes. "
        f"Recommended evacuation direction: {evacuation_dir}. "
        f"Please open the SpreadCast dashboard on your mobile phone immediately "
        f"for live fire tracking and evacuation routes. "
        f"Stay calm. Keep responses under 3 sentences."
    )

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(
                f"{CALLING_AGENT_URL}/trigger-call",
                params={
                    "phone_number": node.phone,
                    "context": context,
                },
            )
            resp.raise_for_status()
            result = resp.json()
            logger.info("Call triggered for node %s (%s): %s", node.node_id, node.label, result)
            return {"node_id": node.node_id, "status": "call_initiated", **result}
    except Exception as e:
        logger.error("Failed to trigger call for node %s: %s", node.node_id, e)
        return {"node_id": node.node_id, "status": "call_failed", "error": str(e)}


# ---------------------------------------------------------------------------
# Event Logging
# ---------------------------------------------------------------------------
def log_event(event: dict):
    """Append a JSON event to the log file."""
    event["timestamp"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    try:
        with open(LOG_FILE, "a") as f:
            f.write(json.dumps(event) + "\n")
    except Exception as e:
        logger.error("Failed to write event log: %s", e)


# ---------------------------------------------------------------------------
# Main Endpoint
# ---------------------------------------------------------------------------
@app.post("/propagate", response_model=PropagationResult)
async def propagate(event: FireEvent, background_tasks: BackgroundTasks):
    """
    Receive a confirmed fire event, predict spread, and trigger emergency calls.
    """
    origin_id = str(event.origin_node_id)

    if origin_id not in NODE_REGISTRY:
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=404,
            content={"error": f"Node {origin_id} not found in registry"},
        )

    origin = NODE_REGISTRY[origin_id]
    origin_lat, origin_lon = origin["lat"], origin["lon"]
    origin_label = origin["label"]

    # Generate incident ID
    now = datetime.datetime.now(datetime.timezone.utc)
    incident_id = f"INC-{now.strftime('%Y%m%d-%H%M%S')}-N{origin_id}"

    logger.info("=" * 60)
    logger.info("INCIDENT %s — Fire at node %s (%s)", incident_id, origin_id, origin_label)
    logger.info("=" * 60)

    # 1. Fetch weather
    weather = await fetch_weather(origin_lat, origin_lon)

    # Wind blows FROM wind_direction_from_deg, so fire spreads TOWARD the opposite
    wind_toward = opposite_bearing(weather["wind_direction_from_deg"])

    # 2. Compute fire spread rates
    ros = compute_rate_of_spread(weather["wind_speed_kmh"], weather["humidity_pct"])
    logger.info(
        "Spread model: head=%.1f m/min, back=%.1f m/min, LB=%.1f",
        ros["head_ros_m_per_min"], ros["back_ros_m_per_min"], ros["lb_ratio"],
    )

    # 3. Calculate ETA for every node (except origin)
    threatened: list[ThreatenedNode] = []
    evacuation_dir = suggest_evacuation_direction(wind_toward)

    for nid, node_data in NODE_REGISTRY.items():
        if nid == origin_id:
            continue

        dist = haversine(origin_lat, origin_lon, node_data["lat"], node_data["lon"])
        brng = bearing_deg(origin_lat, origin_lon, node_data["lat"], node_data["lon"])

        eta = estimate_eta(
            dist, brng, wind_toward,
            ros["head_ros_m_per_min"], ros["back_ros_m_per_min"],
        )

        # Only include nodes reachable within 120 minutes
        if eta <= 120:
            threatened.append(ThreatenedNode(
                node_id=nid,
                lat=node_data["lat"],
                lon=node_data["lon"],
                label=node_data["label"],
                distance_m=round(dist, 1),
                eta_minutes=round(eta, 1),
                phone=node_data["phone"],
            ))

    # Sort by ETA ascending — closest danger first
    threatened.sort(key=lambda n: n.eta_minutes)

    logger.info("Threatened nodes (%d):", len(threatened))
    for t in threatened:
        logger.info("  Node %s (%s): %.0fm away, ETA %.1f min", t.node_id, t.label, t.distance_m, t.eta_minutes)

    # 4. Trigger calls for each threatened node (sequentially by priority)
    call_results = []
    for node in threatened:
        result = await trigger_call_for_node(node, origin_label, weather, evacuation_dir)
        call_results.append(result)

    # 5. Log the incident
    log_event({
        "event": "FIRE_PROPAGATION",
        "incident_id": incident_id,
        "origin_node_id": origin_id,
        "origin_label": origin_label,
        "fire_probability": event.fire_probability,
        "weather": weather,
        "spread_model": ros,
        "threatened_count": len(threatened),
        "threatened_nodes": [t.node_id for t in threatened],
        "call_results_summary": [
            {"node": r["node_id"], "status": r["status"]} for r in call_results
        ],
    })

    result = PropagationResult(
        incident_id=incident_id,
        origin={
            "node_id": origin_id,
            "lat": origin_lat,
            "lon": origin_lon,
            "label": origin_label,
        },
        weather=weather,
        threatened_nodes=threatened,
        call_results=call_results,
    )

    logger.info("Incident %s processing complete.", incident_id)
    return result


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "nodes_loaded": len(NODE_REGISTRY),
        "registry_path": str(REGISTRY_PATH),
    }
