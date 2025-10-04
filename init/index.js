const mongoose=require("mongoose");
const Initdata=require("./data.js");
const listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("Connected to MongoDB");
}).catch(err=> console.log(err));

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB= async ()=>{
    await listing.deleteMany({});
    Initdata.data=Initdata.data.map((obj)=>
        ({...obj,owner:"68bfcca81aed53b4cf558069"}));
    await listing.insertMany(Initdata.data);
    console.log("data inserted success")
}

initDB();