# api/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Gunakan entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# Default command (bisa override di docker-compose)
CMD ["gunicorn", "eduforge.wsgi:application", "--bind", "0.0.0.0:8000"]
