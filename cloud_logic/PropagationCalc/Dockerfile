FROM python:3.12-slim

WORKDIR /app

# Install deps via pip (simpler than uv inside container)
COPY pyproject.toml .
RUN pip install fastapi uvicorn httpx python-dotenv --no-cache-dir

COPY main.py .
COPY .env .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
