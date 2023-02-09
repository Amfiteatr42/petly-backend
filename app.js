const express = require("express");
const app = express();
const http = require('http');

const logger = require("morgan");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const userRouter = require("./_user/routers.js");
const userspetsRouter = require("./_userspets/routers.js");
const categoryRouter = require("./_adscatrgory/routers.js");
const listRouter = require("./_notice/routers.js");
const friendsRouter = require("./_friends/routers.js");
const newsRouter = require("./_news/routers.js");
const messageRouter = require('./_chat/routers.js')

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use('/messages', messageRouter);
app.use("/api/users", userRouter);
app.use("/api/userspets", userspetsRouter);
app.use("/api/adscategory", categoryRouter);
app.use("/api/notice", listRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/news", newsRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});



module.exports = {
  app
};
