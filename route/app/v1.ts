import * as express from "express";
const router = express.Router();
import userAuth from "../../middleware/app/userAuth";

import UserController from "../../controllers/app/user.controller";
import HomeController from "../../controllers/app/home.controller";
import ZcController from './../../controllers/zc.controller';

// USER CONTROLLER
router.post("/register", UserController.register);
router.post("/otp", UserController.checkOTP);
router.post("/login", UserController.login);
router.post("/invoice", userAuth, UserController.makeInvoice);

// HOME CONTROLLERproducts
router.get("/categories", HomeController.getCategories);
router.get("/products/:category", HomeController.getProducts);
router.get("/methods", HomeController.getMethods);
router.get("/invoices", userAuth, HomeController.getInvoices);
router.post("/updateInfo",  UserController.updateInfo);
router.post("/checkUser",  UserController.checkUser);
router.post("/changePassword",  UserController.changePassword);

router.post('/pay',ZcController.pay);
router.get('/redirect',ZcController.redirect)
export default router;
