const passport = require("passport");
const LocalStrategy = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
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
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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

module.exports = passport;