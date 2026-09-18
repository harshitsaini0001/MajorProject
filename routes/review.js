const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const { isLoggedIn, isReviewAuthor, validateReview} = require("../middleware.js");
const listingController=require("../controllers/reviews.js");

//reviews post route
router.post("/",isLoggedIn,validateReview,wrapAsync (listingController.createReview));
//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(listingController.deleteReview));
module.exports=router;