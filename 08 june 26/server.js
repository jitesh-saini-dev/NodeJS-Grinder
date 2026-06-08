const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
// app.use(cors());

app.get("/", (req, res) => {
  res.send("server is running...");
});

//timepass class solu
app.get("/add", (req, res) => {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);
  const c = req.query.c;
  if (!c) {
    return res.status(404).json({
      message: "no record found",
    });
  }

  if (c === "+" || c === " ") {
    return res.json(a + b);
  }
  if (c === "-") {
    return res.json(a - b);
  }
  if (c === "*") {
    return res.json(a * b);
  }
  if (c === "/") {
    return res.json(a / b);
  }
});

app.get("/abc", cors(), (req, res) => {
  const data = [1, 2, 3, 4, 5, 6];

  const c = req.query.c;
  if (!c) {
    return res.status(404).json({
      message: "no record found",
    });
  }

  if (c === "even") {
    const ans = data.filter((x) => x % 2 === 0);
    return res.json(ans);
  }

  if (c === "odd") {
    const ans = data.filter((x) => x % 2 !== 0);
    return res.json(ans);
  }

  if (c === "sum") {
    const ans = data.reduce((acc, x) => acc + x, 0);
    return res.json(ans);
  }
  if (c === "product") {
    const ans = data.reduce((acc, x) => acc * x, 1);
    return res.json(ans);
  }
});

app.listen(5000, () => {
  console.log("server is running at port 5000");
});
