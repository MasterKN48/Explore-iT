const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");

//! DB connect
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("💻 Mondodb Connected");
  })
  .catch((err) => console.error(err));

//* middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors("http://localhost:3000"));

//? setup the logger
if (process.env.NODE_ENV === "dev") {
  app.use(logger("dev"));
} else {
  const fs = require("fs");
  app.use(
    logger("combined", {
      stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
        flags: "a",
      }),
    })
  );
}

//! GraphQL Setup
const typeDefs = require("./typeDefs");
const resolvers = require("./resolver");

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});
server.applyMiddleware({ app });
//!----

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});
