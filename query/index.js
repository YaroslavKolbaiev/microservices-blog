const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvents = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] }; //
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;

    const post = posts[postId]; // find post where comment was created
    post.comments.push({ id, content, status });
  }

  if (type === "CommentModerated") {
    // i sending event from eventBus straight to query instead of sending to comments services first
    const { id, postId, status } = data;

    const post = posts[postId]; // find post where comment was created
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvents(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");

  // if query service is down, after being resumed the query service calls event-bus events to get last updates
  try {
    const res = await axios.get("http://localhost:4005/events");

    for (let event of res.data) {
      console.log("Processing event:", event.type);

      handleEvents(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
