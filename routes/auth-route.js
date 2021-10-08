const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user-model");

router.get("/login", (req, res) => {
    res.render("login.ejs", { user: req.user });
});

router.get("/signup", (req, res) => {
    res.render("signup.ejs", { user: req.user });
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/auth/login",
        failureFlash: "wrong email or password",
    }),
    (req, res) => {
        res.redirect("/profile");
    }
);

router.post("/signup", async (req, res) => {
    console.log(req.body);
    let { name, email, password } = req.body;
    //check email
    let emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
        req.flash("error_msg", "email in use");
        res.redirect("/auth/signup");
    } else {
        let hash = await bcrypt.hash(password, 10);
        password = hash;
        console.log(password);
        let newUser = new User({ name, email, password });
        try {
            const savedUser = await newUser.save();

            req.flash("success_msg", "account created, you can login now");
            res.redirect("/auth/login");
        } catch (err) {
            console.log(err.errors.name.properties.message);
            req.flash("error_msg", err.errors.name.properties.message);
            res.redirect("/auth/signup");
        }
    }
});

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
    })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    res.redirect("/profile");
});
module.exports = router;
