if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();

}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const mo = require("method-override");
const { log } = require("console");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError");
const session = require("express-session");
const flash = require("connect-flash");
const localStrategy = require("passport-local");
const passport = require("passport");
const User = require("./models/user");
const multer = require("multer");
const upload = multer({dest:"uploads/"});
const MongoStore = require("connect-mongo");

const userRouter = require("./routes/user");
/////////////////////
const app = express();
/////////////////////
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(mo("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const db = process.env.ATLAS_URL; 

const store = MongoStore.create({
    mongoUrl:db,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*60*60
});
store.on("error",()=>{
    console.log("Session Store Error",err);
})

const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






async function main() {
    await mongoose.connect(db)
}  

main()
    .then(()=>{
        console.log("Connected");
    })
   .catch((err)=>{
        console.log(err);
    })


    app.use((req,res,next)=>{
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.currentUser = req.user;
        next();
    });


    // app.get("/demouser",async(req,res)=>{
    //     let fake = new User({
    //         email:"mayuresh@gmail.com",
    //         username:"mayuresh",
          
    //     })
    //  let registeredUser = await User.register(fake,"mayuresh");
    //  res.send(registeredUser)
    //     });

    
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



app.all("*",(req,res,next)=>{
    next(new expressError("Page Not Found",404));
});

app.use((err,req,res,next)=>{
    let {status=500,message="Something Went Wrong"}=err;
    res.render("error.ejs",{message});
});

app.listen(4040,()=>{
    console.log("Server Started At Port 4040");
});