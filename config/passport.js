const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
const localStrategy = require("passport-local");
const bcrypt = require("bcrypt");
passport.serializeUser((user, done) => {
    console.log("Serializing user now");
    done(null, user._id);
});

passport.deserializeUser((_id, done) => {
    User.findById({ _id }).then((user) => {
        console.log("found user!");
        done(null, user);
    });
});
passport.use(
    new localStrategy((username, password, done) => {
        console.log(username, password);
        User.findOne({ email: username })
            .then(async (user) => {
                console.log(password, user.password);
                if (!user) return done(null, false);
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        console.log(err);
                        return done(null, false);
                    }
                    if (!result) {
                        console.log(2);
                        return done(null, false);
                    } else {
                        console.log(3);
                        return done(null, user);
                    }
                });
            })
            .catch((err) => {
                console.log(4);
                return done(null, false);
            });
    })
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/redirect",
        },
        (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            User.findOne({ googleID: profile.id }).then((foundUser) => {
                if (foundUser) {
                    console.log("User already exists");
                    done(null, foundUser);
                } else {
                    new User({
                        name: "Google User-" + profile.displayName,
                        googleID: profile.id,
                        thumbnail: profile.photos[0].value,
                        email: profile.emails[0].value,
                    })
                        .save()
                        .then((file) => {
                            console.log("new user created");
                            done(null, file);
                        });
                }
            });
        }
    )
);
