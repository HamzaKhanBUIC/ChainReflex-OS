FROM python:3.9-slim

WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application files (your agents, core, and api)
COPY . .

# Expose the mandatory Hugging Face port
EXPOSE 7860

# Run the API with Uvicorn
CMD ["uvicorn", "api:api", "--host", "0.0.0.0", "--port", "7860"]
