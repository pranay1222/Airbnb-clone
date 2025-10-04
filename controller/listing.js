const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    let {category}=req.query;
    const filter={};
    if(category){
        filter.category=category;
    }

    const allListings=await Listing.find(filter);
    res.render("listings/index.ejs",{allListings});
}

module.exports.createnewlisting=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listings = await Listing.findById(id)
    .populate({path:"reviews",
        populate:{path:"author"}
    })
    .populate("owner");
    if(!listings){
        req.flash("error","Cannot find that listing!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listings});
}

module.exports.createlisting = async (req, res, next) => {
    // 1. Get location string from form
    const addressToGeocode = req.body.listing.location;
    const myAPIKey = "05b1578700df43c3aab0e88d87df9aef"; // It's better to store this in a .env file
    const geocodingUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressToGeocode)}&apiKey=${myAPIKey}`;

    // 2. Make the API call and wait for the result
    const response = await fetch(geocodingUrl);
    const data = await response.json();

    // 3. Create the new listing object
    let newListing = new Listing(req.body.listing);
    
    // Check if geocoding was successful
    if (data.features && data.features.length > 0) {
        // 4. Set the geometry field with the coordinates
        // GeoJSON format requires [longitude, latitude]
        const lon = data.features[0].properties.lon;
        const lat = data.features[0].properties.lat;
        newListing.geometry = { type: 'Point', coordinates: [lat, lon] };
    } else {
        // Optional: Handle cases where the location is not found
        console.log(`Could not find coordinates for: ${addressToGeocode}`);
        // You might want to flash an error and redirect back
        req.flash("error", "Could not find the location specified. Please try a different address.");
        return res.redirect("/listings/new");
    }

    // 5. Add owner and image details
    newListing.owner = req.user._id;
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };
    

    console.log(req.body.listing);
    // 6. Save the complete listing to the database
    await newListing.save();
    
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
};
module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    const listings = await Listing.findById(id);
    if(!listings){
        req.flash("error","Cannot find that listing!");
        return res.redirect("/listings");
    }
    let originalimageUrl=listings.image.url;
    originalimageUrl=originalimageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listings,originalimageUrl});
}

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!=='undefined'){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
}
    req.flash("success","Listing updated successfully!");
    res.redirect("/listings");
}

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted a listing!");
    res.redirect("/listings");
}