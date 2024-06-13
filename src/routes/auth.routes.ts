import { Router } from "express";

import {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} from "../controllers/auth.controllers";
import { signupValidator, loginValidator } from "../validators/auth.validators";

const router = Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyPassResetCode", verifyPassResetCode);
router.put("/resetPassword", resetPassword);


export default router;
