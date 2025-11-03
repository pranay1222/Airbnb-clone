const User=require("../models/user");

module.exports.signup=async (req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Rove & Rest");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("signup");
    }
}

module.exports.login=(req,res)=>{
        req.flash("success","Welcome back to Rove & Rest!");
    res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Successfully logged out!");
        res.redirect("/listings");
    })
}