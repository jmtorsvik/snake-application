const express = require("express");
const cors = require("cors");
const app = express();
const port = 8081;
const fs = require("fs");
const userScores = "./userScores.json";

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log("Backend server running on port " + port);
});

app.get("/scores", (req, res) => {
  fs.readFile(userScores, "utf8", (err, data) => {
    if (err) {
      console.log("File read failed: ", err);
      return;
    }

    res.json(JSON.parse(data));
  });
});

app.post("/scores/:name", (req, res) => {
  putAndPostHelper(req, res, (obj, name, scores) => {
    user = {
      name: name,
      scores: scores,
    };
    obj.push(user);
  })
});

app.put("/scores/:name", (req, res) => {
  putAndPostHelper(req, res, (obj, name, scores) => {
    obj.forEach(user => {
      if (user.name === name) {
        user.scores = scores
      }
    });
  })
});

function putAndPostHelper(req, res, editObject) {
  const name = req.params.name;
  const scores = req.body.scores;

  if (!scores) {
    res.status(418).send({ message: "You need to pass 'scores'" });
    return;
  }

  fs.readFile(userScores, "utf8", (err, data) => {
    if (err) {
      console.log("File read failed: " + err);
      return;
    }

    let obj = JSON.parse(data);

    editObject(obj, name, scores)

    fs.writeFile(userScores, JSON.stringify(obj), "utf8", (err2) => {
      console.log(err2 ? "File write failed: " + err2 : "User data added");
    });
  });
}
