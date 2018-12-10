const express = require("express");
const router = express.Router();
const PageController = require("./../controllers/page_controller");
const AuthenticationController = require("./../controllers/authentication_controller");
const { celebrate, Joi } = require("celebrate");
const { authRedirect, authorise } = require("./../middleware/authorisation_middleware");

router.get("/", PageController.index);

router.get("/logout", AuthenticationController.logout);

router.get("/register", authRedirect, AuthenticationController.registerNew);

router.post("/register", celebrate({
    body: {
        email: Joi.string().required(),
        password: Joi.string().required()
    }
}), AuthenticationController.registerCreate);

router.get("/dashboard", authorise, PageController.dashboard);

router.get("/login", authRedirect, AuthenticationController.loginNew);

router.post("/login", celebrate({
    body: {
        email: Joi.string().required(),
        password: Joi.string().required()
    }
}), AuthenticationController.loginCreate);

module.exports = router;