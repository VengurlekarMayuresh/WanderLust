const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}
main()
    .then(()=>{
        console.log("Connected");
    })
   .catch((err)=>{
        console.log(err);
    })

const initDb = async()=>{
    await Listing.deleteMany({});
   initData.data=  initData.data.map((obj)=>({
        ...obj,
        owner:"67bdffb6fc0acd0523f9d508",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
}

initDb();