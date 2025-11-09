from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")

client = AsyncIOMotorClient(MONGODB_URI)
database = client[DB_NAME]
print("✅ Connected to MongoDB database:", DB_NAME)

# Define collections
users_collection = database["users"]
predictions_collection = database["predictions"]
contacts_collection = database["contacts"]
