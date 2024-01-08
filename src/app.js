import express from "express";

const app = express();
app.get("/", (req, res) => {
  res.send("this is a server");
});
const PORT = process.env.PORT || 8000;

export default app;
