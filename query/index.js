const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

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
    const { id, postId, status } = data;

    const post = posts[postId]; // find post where comment was created
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
  }
  res.send({});
});

app.listen(4002, () => {
  console.log("Listening on 4002");
});
