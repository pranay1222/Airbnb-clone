const Listing=require("./models/listing");
const {Listingschema,ReviewSchema}=require("./schema.js");
const ExpressError = require('./utils/ExpressError.js');


module.exports.Loggedin=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be login first!");
        res.redirect("/login");
    }
    next();
}

module.exports.saveUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listings=await Listing.findById(id);
    if(!listings.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=Listingschema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=ReviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
}