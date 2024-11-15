import express from "express";
import { nanoid } from "nanoid";
import * as fs from "fs";

const PORT = 8000;

const app = express();

app.use(express.json());

app.get("/users", (_req, res) => {
  const user = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  return res.send(user);
});

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  const users = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

  const newUser = {
    id: nanoid(),
    name: name,
    email: email,
    password: password,
  };

  fs.writeFileSync("./data.json", JSON.stringify([...users, newUser]));

  res.status(201).json({ message: "New user created" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

  const checkUser = users.find((user) => user.email === email);

  if (!checkUser) {
    return res.status(404).send({ message: "Iim hereglegch oldsongue" });
  }

  if (checkUser.password !== password) {
    return res.status(404).send({ message: "Incorrect password" });
  }

  return res.status(200).json({ message: "Amjilttai newterlee" });
});

app.listen(PORT, () => {
  console.log(`Servers is running http://localhost:${PORT}`);
});
