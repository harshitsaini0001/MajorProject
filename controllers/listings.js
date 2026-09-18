const axios = require('axios');
const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    const allListing= await Listing.find({});
     res.render("listings/index.ejs",{allListing});
}
module.exports.renderNewForm=(req,res)=>{ 
    res.render("listings/new.ejs");
}
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(listing.owner);
    if(!listing){
     req.flash("error","Listing you requested does not exist!");
     return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async (req, res) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;
        let { title, description, price, country, location } = req.body.listing;
        
        let longitude = 0;
        let latitude = 0;

        if (location) {
            const baseGeoUrl = 'https://nominatim.openstreetmap.org/search';
            const queryParams = `?q=${encodeURIComponent(location)}&format=json&limit=1`;
            const finalUrl = `${baseGeoUrl}${queryParams}`;

            console.log("Requesting URL:", finalUrl);

            try {
                const response = await axios.get(finalUrl, {
                    headers: { 'User-Agent': 'MyPropertyListingApp/1.0' },
                    timeout: 5000
                });

                if (response.data && response.data.length > 0) {
                    latitude = parseFloat(response.data[0].lat);
                    longitude = parseFloat(response.data[0].lon);
                    console.log(`Successfully mapped: [${longitude}, ${latitude}]`);
                }
            } catch (netErr) {
                console.error("Geocoding Network/DNS Error:", netErr.message);
            }
        }

        let newListing = new Listing({ title, description, price, country, location });
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = {
            type: "Point",
            coordinates: [longitude, latitude]
        };


        let result=await newListing.save();
        console.log(result);
        req.flash("success", "New Listing Created");
        res.redirect("/listings");

    } catch (error) {
        console.error("Main Controller Error:", error);
        req.flash("error", "Failed to create listing.");
        res.redirect("/listings/new");
    }
};

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
        if(!listing){
     req.flash("error","Listing you requested does not exist!");
     return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}
module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
        
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}
module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    let deletedList=await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}