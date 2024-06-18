const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

// MongoDB connection URI from environment variable or default value
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://JupiterAdmin:FuapxB93@cluster0.drdxrvm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function addData() {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db("test");
    const collection = db.collection("users");

    // Insert a test document
    const result = await collection.insertOne({
      username: "username_value",
      password: "password_value",
    });

    console.log("Data inserted successfully:", result.insertedId);
  } catch (err) {
    console.error("Failed to insert data:", err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

addData().catch(console.dir);
