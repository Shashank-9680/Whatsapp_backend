import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import createHttpError from "http-errors";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const app = express();
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });
//morgan

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

//helmet
app.use(helmet({ crossOriginEmbedderPolicy: false, originAgentCluster: true }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data: blob:"],
    },
  })
);
//parse json request url
app.use(express.json());
//parse json request body
app.use(express.urlencoded({ extended: true }));
//sanitize request data
app.use(mongoSanitize());
//enable cookie parser
app.use(cookieParser());
// gzip compression
app.use(compression());
//file upload
app.use(fileUpload({ useTempFiles: true }));
//cors
app.use(cors());
//api v1 routes
app.use("/api/v1", routes);
app.use(express.static(path.resolve(__dirname, "../build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
app.use(async (req, res, next) => {
  next(createHttpError.NotFound("this route does not exist"));
});
//error handling
app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

export default app;
