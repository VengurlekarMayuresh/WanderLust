const User = require("../models/user.js");
const flash = require("connect-flash");


module.exports.postSignup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
       const reg =  await User.register(newUser,password);
       console.log(reg);
       req.login(reg,(err)=>{
           if(err) return next(err);
           req.flash("success","Welcome to WanderLust");
           res.redirect("/listings");
       });
    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.getSignup = (req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.getLogin = (req,res)=>{
    res.render("user/login.ejs");
}

module.exports.postLogin = async(req,res)=>{
    req.flash("success","Welcome to WanderLust");
    let redirectUrl = res.locals.url || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err) return next(err);
        req.flash("success","You are Logged Out");
        res.redirect("/listings");
    })
}