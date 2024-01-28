let User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
User = User.user;

// SIGNUP : Generate token , hash password, Create user with username ,EMAIL , hashed password AND TOKEN.
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    var token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY);
    const hash = bcrypt.hashSync(toString(req.body.password), 10);
    user.token = token;
    user.password = hash;
    try {
      user.save();
      const newUser = await User.findOne({ token: token });
      res.status(201, "User Created").send(newUser);
    } catch (err) {
      res.status(401, "User not created").json(err);
    }
  } catch (err) {
    res.status(401, "Token not created").json(err);
  }
};

// LOGIN :
exports.login = async (req, res) => {
  // find user using email(unique) ==>compare the hashed password stored in remote DB to input password. Then
  // if both passwords (req.body.password === DBUser.password) are same (return true) then
  // Generate new token and save it to UserDB record and return the token (which is stored at frontend in window.localStorage.token. This is send by using bearer auth.. header for checking the auth in other routes, is wether logged in or not. )

  try {
    const user = await User.findOne({ email: req.body.email });
    const isAuth = bcrypt.compareSync(
      toString(req.body.password),
      user.password
    );
    if (isAuth) {
      const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY);
      user.token = token;
      user.save();
      res.json({ token: token });
    } else {
      res.sendStatus(401).json({ message: "Not Authorised" });
    }
  } catch (err) {
    res.status(401).json(err);
  }
};
