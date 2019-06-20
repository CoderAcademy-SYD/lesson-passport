const passport = require("passport");
const LocalStrategy = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const UserModel = require("./../database/models/user_model");

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});

passport.use(new LocalStrategy({ 
        usernameField: "email" 
    }, 
    async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email });

            if (user && user.verifyPasswordSync(password)) {
                return done(null, user);
            }

            return done(null, false);
        } catch (error) {
            return done(error);
        }
    }
));

passport.use(new JwtStrategy(
    {
        jwtFromRequest: (req) => {
            return (req && req.cookies) ? req.cookies["jwt"] : null;
        },
        secretOrKey: process.env.JWT_SECRET
    },
    async (jwtPayload, done) => {
        try {
            const user = await UserModel.findById(jwtPayload.sub);

            if (user) {
                return done(null, user);
            }

            return done(null, false);
        } catch(error) {
            return done(error);
        }
    } 
));

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "http://localhost:3000/auth/google"
    },
    async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        let user = await UserModel.findOne({ email });

        if (user) {
            return done(null, user);
        }

        user = await UserModel.create({ email, password: "Testing1" });

        return done(null, user);
    }
));

module.exports = passport;