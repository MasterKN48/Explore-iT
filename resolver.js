const { AuthenticationError } = require("apollo-server-express");
const Pin = require("./models/Pin");

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
      console.log(ctx.currentUser._id);
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id,
      }).save();
      const pinAdded = await Pin.populate(newPin, "author");
      return pinAdded;
    }),
    deletePin: authenticated(async (r, a, ctx) => {
      const pinDelete = await Pin.findOneAndDelete({ _id: a.pinId }).exec();
      return pinDelete;
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
      return pinUpdated;
    }),
  },
};
