const express = require("express");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
dotenv.config();
const PORT = 8080;
const connnectToDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};
connnectToDB();
const hashPasswordMiddleware = async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    next();
  } catch (error) {
    res.status(500).send("Error processing password");
  }
};
const validatePasswordMiddleware = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).send("Error validating password");
  }
};

app.post("/signup", hashPasswordMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = { name, email, password };
    const response = await db.collection("users").insertOne(newUser);
    res
      .status(201)
      .send({ message: "User created", userId: response.insertedId });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating user");
  }
});
app.post("/login", validatePasswordMiddleware, (req, res) => {
  res.status(200).send({ message: "Login successful", userId: req.user._id });
});
app.get("/users", async (req, res) => {
  const users = await db.collection("users").find().toArray();
  res.status(200).send(users);
});
app.get("/theaters", async (req, res) => {
  const theaters = await db.collection("theaters").find().toArray();
  res.status(200).send(theaters);
});
app.post("/users", async (req, res) => {
  try {
    const user = req.body;
    console.log(user);
    const response = await db.collection("users").insertOne(user);
    res.send(response);
  } catch (error) {
    res.send(`error: ${error}`);
  }
});
app.put("/users", async (req, res) => {
  try {
    const { name, email, id } = req.body;
    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: { name, email } });
    res.send("done");
  } catch (error) {
    console.log(error);
    res.send("failed to update user");
  }
});
app.delete("/users", async (req, res) => {
  try {
    const { id } = req.body;
    const response = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send("failed to delete user");
  }
});
app.listen(PORT, () => console.log(`running on ${PORT}`));
