FROM python:3.10-slim

WORKDIR /app

# Install system dependencies if any (usually not needed for this stack)
# RUN apt-get update && apt-get install -y ...

# Copy requirements
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY backend/ backend/

# Expose port (Koyeb usually defaults to 8000 for Python/gunicorn/uvicorn)
EXPOSE 8000

# Start command
# Adjust host/port as needed. Koyeb uses PORT env var usually, or listens on 8000.
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
