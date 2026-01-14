import os
from openai import OpenAI
from dotenv import load_dotenv

# Load credentials from .env
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Simple 'Hello World' sanity check
response = client.chat.completions.create(
  model="gpt-4o",
  messages=[{"role": "user", "content": "Hello Agent! Are you ready to manage store rentals?"}]
)

print(f"Agent Response: {response.choices[0].message.content}")