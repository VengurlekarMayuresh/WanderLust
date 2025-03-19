const Listing = require("../models/listing.js");


module.exports.index = async(req,res)=>{
    const allList = await Listing.find({});
     res.render("listings/index.ejs",{allList});
 }

module.exports.new = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.show = async(req,res)=>{
     let {id} = req.params;
    const listShow = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        },
 }).populate("owner"); 
    const currUser = req.user;
    if(!listShow){
        req.flash("error","Cannot find that listing");
        return res.redirect("/listings");
    }
    console.log(listShow);
    res.render("listings/show.ejs",{listShow,currUser});
 }


 module.exports.create = async (req, res) => {
    //  if (!req.body.listing.image || !req.body.listing.image.url) {
    //      req.body.listing.image = {
    //          url: "https://defaultimageurl.com"
    //      };
    //  }
     let url = req.file.path;
     let filename = req.file.filename;
     const list = new Listing(req.body.listing);
     list.owner = req.user._id;
     list.image = {url,filename};   
     console.log(`${list.image.url} ... ${list.image.filename}`);
     await list.save();
     console.log(req.body);
     req.flash("success", "Successfully made a new listing");
    return res.redirect("/listings");
 }

 module.exports.editForm = async(req,res)=>{
     let {id} = req.params;
    let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
     if(typeof req.file!== "undefined"){
         let url = req.file.path;
         let filename = req.file.filename;
         listing.image = {url,filename};
         await listing.save();
     }
     req.flash("success","Successfully updated a listing");
     res.redirect(`/listings/${id}`);
 }

 module.exports.edit = async(req,res)=>{
     let {id} = req.params;
     const listing = await Listing.findById(id);
     if(!listing){
            req.flash("error","Cannot find that listing");
            return res.redirect("/listings");
     }
     let ogUrl = listing.image.url;
     ogUrl = ogUrl.replace("/upload","/upload/w_250");
     res.render("listings/edit.ejs",{listing,ogUrl}); 
 }

 module.exports.delete = async(req,res)=>{
    let {id} = req.params;
    let del = await Listing.findByIdAndDelete(id);
   req.flash("success","Successfully deleted a listing");
    res.redirect("/listings");
}
