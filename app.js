if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ejs=require("ejs");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError = require('./utils/ExpressError.js');
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch(err=> console.log(err));

async function main(){
    await mongoose.connect(dbUrl);
}


//session store in mongoDB.......

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})
store.on("error",()=>{
    console.log("Session Store Error");
})
//
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter);

app.get("/",(req,res)=>{
    console.log("root");
});

// app.get("/demo",async(req,res)=>{
//     const fakeUser=new User({
//         email:"ananya@gmail.com",
//         username:"ananya"
//     })

//     let registeredUser=await User.register(fakeUser,"pranaya");
//     res.send(registeredUser);
// })
// app.get("/test",async (req,res)=>{
//     let sampleListings= new Listing({
//         title:"hotel",
//         description:"hotel 2 room with 2 letbatth.",
//         price:10000,
//         location:"bali",
//         country:"indonesia",
//     }) 
//     await sampleListings.save().then(()=>{
//         console.log("Sample listing saved");
//     }).catch(err=>{
//         console.log("Error saving sample listing:", err);
//     });
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.render("./listings/error.ejs",{err});
});
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})