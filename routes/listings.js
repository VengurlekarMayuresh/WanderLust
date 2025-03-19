const express = require("express");
const router = express.Router();    
const wrapAsync = require("../utils/wrapAsync");
router.use(express.json());
router.use(express.urlencoded({extended:true}));
const {LoggedIn,isOwner,validateListing} = require("../middle.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// const isOwner = require("../middle.js")

const control = require("../controller/listings.js");

router.route("/")
    .get(wrapAsync(control.index))
    .post(
        LoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(control.create)
    );

 router.get("/new",LoggedIn,wrapAsync(control.new));

 router.route("/:id")
    .get(wrapAsync(control.show))
    .put(LoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(control.editForm))
        .delete(LoggedIn,
        wrapAsync(control.delete));

router.get("/:id/edit",LoggedIn,wrapAsync(control.edit));

module.exports = router;