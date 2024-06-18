const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function authenticateUser(username, password) {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const collection = client.db("test").collection("users");
    const user = await collection.findOne({ username });

    if (!user) {
      return { success: false, message: "User does not exist" };
    } else if (user.password !== password) {
      return { success: false, message: "Password is incorrect" };
    } else {
      return { success: true, message: "Login successful!" };
    }
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    return { success: false, message: "Server error" };
  } finally {
    await client.close();
  }
}

module.exports = {
  authenticateUser,
};
