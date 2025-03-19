const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const expressError = require("./utils/expressError");;
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.LoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.url = req.originalUrl;
        console.log(req.session.url);
        req.flash("error","You must be logged in");

        return res.redirect("/login");
    }
    next();
}

module.exports.saveUrl = (req,res,next)=>{
    if(req.session.url){
        res.locals.url = req.session.url;
        console.log(res.locals.url);

    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let updateList=  await Listing.findById(id);
    if( !res.locals.currentUser._id.equals(updateList.owner)){
        req.flash("error","You do not have permission to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if( !res.locals.currentUser._id.equals(review.author)){
        req.flash("error","You do not have permission to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        let msg = error.details.map(el=>el.message).join(",");
        throw new expressError(msg,400);
}else{
    next();
}};

module.exports.validateReview = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let msg = error.details.map(el=>el.message).join(",");
        throw new expressError(msg,400);
}else{
    next();
}};