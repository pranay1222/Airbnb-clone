const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {  // Change from String to Object
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review"
  }],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category:{
    type:String,
    enum:["Mountains","Trending","Rooms","Iconic-Cities","Castles","Camping","Boats","Farms"]
  }
  
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
  }
})

listingSchema.index({ category: 1 });
listingSchema.index({ owner: 1 });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;