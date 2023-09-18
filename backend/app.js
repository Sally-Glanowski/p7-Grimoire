const express = require('express');
const bookRoutes = require("./routes/book");
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sallyG:p7@cluster0.9gb0lfj.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

  
  app.use("/api/books", bookRoutes);
  app.use("/api/auth", userRoutes);
  
  // Tells express to handle the images ressource statically (a sub-directory of our root directory, __dirname) whenever it gets a request to the /images route
  app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;