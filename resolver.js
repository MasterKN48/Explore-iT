const { AuthenticationError } = require("apollo-server-express");

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
  },
};
