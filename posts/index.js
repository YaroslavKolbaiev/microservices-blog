const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};
const eventBusURL = "http://localhost:4005/events";

app.get("/posts", (req, res) => {
  // after creating query service, this request is not required anymore
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios.post(eventBusURL, {
    type: "PostCreated",
    data: { id, title },
  }); // after the post is created we notify eventBus by sending post request

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  const { type } = req.body;

  console.log(type);
  res.status(201);
});

app.listen(4000, () => {
  console.log("v55");
  console.log("Listeting on 4000");
});
