FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

# Use gunicorn with gevent worker for WebSocket support
# Single worker avoids broker token conflicts (broker allows one session per client-name)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--worker-class", "gevent", "--worker-connections", "1000", "--timeout", "120", "app:app"]