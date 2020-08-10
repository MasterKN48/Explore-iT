const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
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
app.use(compression());
app.use(helmet());
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

const { findeOrCreateUser } = require("./controllers/user");

//! GraphQL Setup
const typeDefs = require("./typeDefs");
const resolvers = require("./resolver");

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: async ({ req, connection }) => {
    let authToken = null;
    let currentUser = null;
    if (connection) {
      return connection.context;
    } else {
      try {
        authToken = req.headers.authorization;
        if (authToken) {
          //find user in DB
          currentUser = await findeOrCreateUser(authToken);
          // or create User
        }
      } catch (error) {
        console.log(error);
        console.log("Unable to authenticate user with token");
      }
      return { currentUser };
    }
  },
  playground: process.env.NODE_ENV === "dev" ? true : false,
});

server.applyMiddleware({
  app,
  path: "/api/graphql",
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
//!----

app.get("/api/test", (req, res) => {
  return res.send("Hello");
});

app.use(express.static("client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

httpServer.listen(process.env.PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`
  );
});
