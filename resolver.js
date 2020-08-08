const user = {
  _id: "1",
  name: "Reed",
  email: "sss@ds.com",
  picture: "sfsfs",
};

module.exports = {
  Query: {
    me: (p, a) => user,
  },
};
