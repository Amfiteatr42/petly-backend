const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const userRouter = require("./_user/routers.js");
const userspetsRouter = require("./_userspets/routers.js");
const categoryRouter = require("./_adscatrgory/routers.js");
const listRouter = require("./_ads/routers.js");
const friendsRouter = require("./_friends/routers.js");
const newsRouter = require("./_news/routers.js");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/userspets", userspetsRouter);
app.use("/api/adscategory", categoryRouter);
app.use("/api/ads", listRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/news", newsRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
