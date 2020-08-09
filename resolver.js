const { AuthenticationError, PubSub } = require("apollo-server-express");
const Pin = require("./models/Pin");

const pubSub = new PubSub();
const PIN_ADDED = "PIN_ADDED";
const PIN_DELETED = "PIN_DELETED";
const PIN_UPDATED = "PIN_UPDATED";

const authenticated = (next) => (root, args, ctx, info) => {
  //console.log(ctx.currentUser);
  if (!ctx.currentUser) {
    throw new AuthenticationError("You must ne logged in");
  }
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((p, a, ctx, _) => ctx.currentUser),
    getPins: async (p, a, ctx) => {
      let pins = await Pin.find({})
        .populate("author")
        .populate("comments.author");
      return pins;
    },
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx, _) => {
      //console.log(ctx.currentUser._id);
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id,
      }).save();
      const pinAdded = await Pin.populate(newPin, "author");
      pubSub.publish(PIN_ADDED, { pinAdded });
      return pinAdded;
    }),
    deletePin: authenticated(async (r, a, ctx) => {
      const pinDeleted = await Pin.findOneAndDelete({ _id: a.pinId }).exec();
      pubSub.publish(PIN_DELETED, { pinDeleted });
      return pinDeleted;
    }),
    createComment: authenticated(async (r, a, ctx) => {
      const newComment = { text: a.text, author: ctx.currentUser._id };
      let pinUpdated = await Pin.findOneAndUpdate(
        { _id: a.pinId },
        { $push: { comments: newComment } },
        { new: true }
      )
        .populate("author")
        .populate("comments.author");
      pubSub.publish(PIN_UPDATED, { pinUpdated });
      return pinUpdated;
    }),
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubSub.asyncIterator(PIN_ADDED),
    },
    pinUpdated: {
      subscribe: () => pubSub.asyncIterator(PIN_UPDATED),
    },
    pinDeleted: {
      subscribe: () => pubSub.asyncIterator(PIN_DELETED),
    },
  },
};
