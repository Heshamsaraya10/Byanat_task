import { RequestHandler, Router } from "express";
import { authentication } from "../middlewares/authentication.middleware";
import { authorization } from "../middlewares/authorization.middleware";
import {
  createUser,
  getSingleUser,
  getAllUsers,
  updateUser,
  deleteUser,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} from "../controllers/user.controllers";
import {
  createUserValidator,
  getAllUsersValidator,
  getSingleUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} from "../validators/user.validator";

const router = Router();
router.use(authentication);

router.get("/getMe", getLoggedUserData, getSingleUser);
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);

//Admin
router.use(authorization("admin", "manager"));

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/")
  .get(getAllUsersValidator, getAllUsers as RequestHandler)
  .post(createUserValidator, createUser as RequestHandler);

router
  .route("/:id")
  .get(getSingleUserValidator, getSingleUser as RequestHandler)
  .put(updateUserValidator, updateUser as unknown as RequestHandler)
  .delete(deleteUserValidator, deleteUser as RequestHandler);

export default router;
