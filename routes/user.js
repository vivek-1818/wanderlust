const express = require("express")
const wrapAsync = require("../utils/wrapAsync")
const router = express.Router()
const User = require("../models/user.js")
const { route } = require("./review")
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware.js")
const userController = require("../controllers/user.js")

router.route("/signup")
    .get(userController.signupForm)
    .post(wrapAsync(userController.signup))

router.route("/login")
    .get(userController.loginForm)
    .post(saveRedirectUrl, userController.login);

router.get("/logout",userController.logout)

module.exports = router;