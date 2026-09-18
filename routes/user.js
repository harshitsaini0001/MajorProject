const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const listingController=require("../controllers/users.js");

router.route("/signup")
.get(listingController.renderSignupForm)
.post(wrapAsync(listingController.signUp));

router.route("/login")
.get(listingController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate('local', 
    { failureRedirect: '/login' ,
        failureFlash:true}),
        listingController.login);

router.get("/logout",listingController.logout);
module.exports=router;