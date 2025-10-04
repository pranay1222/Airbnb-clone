const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const {saveUrl}=require("../middleware.js");
const UserController=require("../controller/user.js");


router
.route("/signup")
.get((req,res)=>{
    res.render("./users/signup.ejs");
})
.post(WrapAsync(UserController.signup));

router
.route("/login")
.get((req,res)=>{
    res.render("./users/login.ejs");
})
.post(saveUrl,passport.authenticate('local',
    {failureRedirect:"/login",
        failureFlash:true}),UserController.login);

        
router.get("/logout",UserController.logout);
module.exports=router;