const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://hrao1428:MzJJVee3Hapu8JQw@cluster0.xrnyt97.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected successfully to MongoDB Atlas");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.close();
  }
}

run();
