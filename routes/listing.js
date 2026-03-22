const express=require("express");
const router=express.Router();
const rateLimit=require("express-rate-limit");
const WrapAsync=require("../utils/WrapAsync.js");
const Listing=require("../models/listing");
const ExpressError = require('../utils/ExpressError.js');
const {Listingschema,ReviewSchema}=require("../schema.js");
const {Loggedin,isOwner}=require("../middleware.js");
const {validateListing}=require("../middleware.js");
const listingContrtoller = require("../controller/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});

const listingsReadLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

const listingsWriteLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
});

router.route("/")
//Index route 
.get(listingsReadLimiter,WrapAsync(listingContrtoller.index))

//create route
.post(Loggedin,upload.single('listing[image]'),validateListing,WrapAsync(listingContrtoller.createlisting))
//create new listing
router.get("/new",Loggedin,listingContrtoller.createnewlisting)

router.route("/:id")
//Show route 
.get(listingsReadLimiter,WrapAsync(listingContrtoller.showListing)
)
//update route
.put(listingsWriteLimiter,Loggedin,isOwner,upload.single('listing[image]'),validateListing,WrapAsync(listingContrtoller.updateListing)
)
//delete route
.delete(Loggedin,isOwner,WrapAsync(listingContrtoller.deleteListing)
)

//edit route
router.get("/:id/edit",Loggedin,isOwner,WrapAsync(listingContrtoller.editListing)
)


module.exports=router;