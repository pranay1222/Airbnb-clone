const express=require("express");
const router=express.Router({mergeParams:true});
const WrapAsync=require("../utils/WrapAsync.js");
const ExpressError = require('../utils/ExpressError.js');
const Listing=require("../models/listing");
const {Listingschema,ReviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const {validateReview,Loggedin}=require("../middleware.js");
const reviewContrtoller = require("../controller/review.js");

//Review
//post route
router.post("/",Loggedin,validateReview,WrapAsync(reviewContrtoller.newReview));

//delete route
router.delete("/:reviewId",Loggedin,WrapAsync(reviewContrtoller.destroyReview));

module.exports=router;