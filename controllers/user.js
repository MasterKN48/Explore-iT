const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.CLIENT_ID);

exports.findeOrCreateUser = async (token) => {
  //verify auth token
  //console.log(token, "Se--12");
  const googleUser = await verifyAuthToken(token);
  //check user exists
  //console.log(googleUser);
  const user = await checkUserExits(googleUser.email);
  //else new User
  //console.log(user);
  return user ? user : newUser(googleUser);
};

const verifyAuthToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (error) {
    console.log("Error to verify auth token");
  }
};
const checkUserExits = async (email) => await User.findOne({ email }).exec();

const newUser = async (googleUser) => {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };
  return await new User(user).save();
};
