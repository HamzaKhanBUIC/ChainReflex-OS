# Use a multi-stage build to keep the image size small

# --- Stage 1: Build the Frontend ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Final Image ---
FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js in the final image to run the Next.js server (if not using static export)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

WORKDIR /app

# Copy requirements and install backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy frontend build and code
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/
COPY --from=frontend-builder /app/frontend/node_modules ./frontend/node_modules
COPY frontend/next.config.mjs ./frontend/

# Create a startup script to run both backend and frontend
RUN echo '#!/bin/bash\n\
python backend/api.py & \n\
cd frontend && npm run start\n\
' > /app/start.sh && chmod +x /app/start.sh

# HF Spaces usually expects port 7860, but our apps are on 8000 and 3000.
# We might need a proxy or to adjust the ports. 
# For now, let's expose the ports.
EXPOSE 8000
EXPOSE 3000

CMD ["/app/start.sh"]
