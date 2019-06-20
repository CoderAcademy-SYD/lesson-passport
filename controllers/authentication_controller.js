const UserModel = require("./../database/models/user_model");
const jwt = require("jsonwebtoken");

function registerNew(req, res) {
    res.render("authentication/register");
}

async function registerCreate(req, res, next) {
    const { email, password } = req.body;
    const user = await UserModel.create({ email, password });
    
    req.login(user, (error) => {
        if (error) {
            return next(error);
        }

        return res.redirect("/dashboard");
    });
}

function logout(req, res) {
    req.logout();
    res.redirect("/");
}

function loginNew(req, res) {
    res.render("authentication/login");
}

async function loginCreate(req, res) {
    const token = jwt.sign({ sub: req.user._id }, process.env.JWT_SECRET);
    res.json(token);
}

module.exports = {
    registerNew,
    registerCreate,
    logout,
    loginNew,
    loginCreate
}