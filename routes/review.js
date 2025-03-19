const express = require("express");
const router = express.Router({mergeParams:true}); 
const wrapAsync = require("../utils/wrapAsync");
const {validateReview} = require("../middle.js");
const {LoggedIn,isAuthor} = require("../middle.js");

const control = require("../controller/reviews.js");

router.post("/",LoggedIn,validateReview,wrapAsync(control.createReview));

router.delete("/:reviewId",isAuthor,wrapAsync(control.deleteReview));

module.exports = router;