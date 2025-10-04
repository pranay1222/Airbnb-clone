const express=require("express");
const router=express.Router();
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


router.route("/")
//Index route 
.get(WrapAsync(listingContrtoller.index))

//create route
.post(Loggedin,upload.single('listing[image]'),validateListing,WrapAsync(listingContrtoller.createlisting))
//create new listing
router.get("/new",Loggedin,listingContrtoller.createnewlisting)

router.route("/:id")
//Show route 
.get(WrapAsync(listingContrtoller.showListing)
)
//update route
.put(Loggedin,isOwner,upload.single('listing[image]'),validateListing,WrapAsync(listingContrtoller.updateListing)
)
//delete route
.delete(Loggedin,isOwner,WrapAsync(listingContrtoller.deleteListing)
)

//edit route
router.get("/:id/edit",Loggedin,isOwner,WrapAsync(listingContrtoller.editListing)
)


module.exports=router;