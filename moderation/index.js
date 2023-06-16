const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const eventBusURL = "http://event-bus-srv:4005/events";

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.includes("red") ? "rejected" : "approved";

    await axios.post(eventBusURL, {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content, // ??? what for
      },
    });

    res.send({});
  }
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});
