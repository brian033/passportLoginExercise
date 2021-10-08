const router = require("express").Router();
const Post = require("../models/post-model");
const authCheck = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect("/auth/login");
        console.log("need login");
    } else {
        console.log("do not need login");
        next();
    }
};

router.get("/", authCheck, async (req, res) => {
    let postFound = await Post.find({ author: req.user._id });
    res.render("profile.ejs", { user: req.user, posts: postFound });
});
router.get("/post", authCheck, (req, res) => {
    res.render("post.ejs", { user: req.user });
});
router.post("/post", authCheck, async (req, res) => {
    let { title, content } = req.body;
    let newPost = new Post({
        title,
        content,
        author: req.user._id,
    });
    try {
        await newPost.save();
        res.status(200).redirect("/profile");
    } catch (err) {
        req.flash("error_msg", "Both title and content are required.");
        res.redirect("/profile/post");
    }
});

module.exports = router;