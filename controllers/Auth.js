const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      //Never put role in here, end_user cannot create himself as "Admin"
      //Use POST /api/v1/user to perform this action, but need role to be "admin"
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
    });

    res.status(201).send(newUser);
  } catch (error) {
    console.error(error);
  }
};

// log in the user
const signToken = (id) => {
  return jwt.sign(id, "Blog");
};

const createSendToken = (user, statusCode, res) => {
  //Generate the JWT Token with user id
  const token = signToken({
    id: user._id,
    username: user.username,
  });

  //Filter out, do not expose to user
  ["password", "salt", "__v"].forEach((el) => {
    user[el] = undefined;
  });

  //CookieOptions for sending
  const cookieOptions = {
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    data: {
      user: user,
    },
  });
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Cannot find username or password !");
    }

    const user = await User.findOne({ username: username }).select("+password");

    if (!user || !(await user.checkCorrectness(password, user.password))) {
      return res.status(401).send("username or password not true !");
    }

    createSendToken(user, 200, res);
  } catch (error) {
    console.log(error);
  }
};

exports.protected = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .send("You have not login yet !! Please login to use this funciton.");
    }

    const verify = jwt.verify(token, "Blog");

    const currentUser = await User.findById(verify.id);
    if (!currentUser) {
      return res.status(401).send("User attach with token are not exist");
    }

    req.user = currentUser;
    return next();
  } catch (error) {
    console.log(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("jwt");

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.log(error);
  }
};
