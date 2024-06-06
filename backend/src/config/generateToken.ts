const jwt = require("jsonwebtoken");

const generateToken = (user:any) => {
    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
    };
  return jwt.sign({ payload}, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
