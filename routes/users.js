const express = require("express");
const router = express.Router();
const userController = require("../controllers/Auth");
/* GET users listing. */
router.get("/", userController.protected, function (req, res, next) {
  res.send(req.user)
});

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.post("/logout", userController.logout);


module.exports = router;
