const express = require("express");
const app = express();
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

//db connect
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("💻 Mondodb Connected");
    require("./cron.js").backup();
  })
  .catch((err) => console.error(err));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setup the logger
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
} else {
  app.use(
    logger("combined", {
      stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
        flags: "a",
      }),
    })
  );
}

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});
