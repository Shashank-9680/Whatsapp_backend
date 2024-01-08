import app from "./app.js";

const PORT = process.env.PORT || 8000;
console.log(process.env.NODE_ENV);
app.listen(PORT, () => {
  console.log(`server is listening at ${PORT}...`);
});
