const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};
const eventBusURL = "http://localhost:4005/events";

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []); // after creating the query service, this request is not required anymore
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[req.params.id] = comments;

  await axios.post(eventBusURL, {
    type: "CommentCreated",
    data: { id: commentId, content, postId: req.params.id, status: "pending" },
  }); // after the comment is created we notify eventBus by sending post request

  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  const { type } = req.body;

  console.log(type);
  res.status(201);
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
