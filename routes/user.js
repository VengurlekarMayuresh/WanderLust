const express = require("express");
const router = express.Router();   
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveUrl} = require("../middle.js");
const control = require("../controller/user.js");

router.get("/signup",control.getSignup);

router.post("/signup", wrapAsync(control.postSignup));

router.get("/login",control.getLogin);

router.post("/login",saveUrl, passport.authenticate("local",{failureRedirect :"/login" , failureFlash:true }) ,control.postLogin);

router.get("/logout",control.logout);

module.exports = router;