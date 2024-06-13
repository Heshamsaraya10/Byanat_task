import { RequestHandler, Router } from "express";
import { authentication } from "../middlewares/authentication.middleware";
import { authorization } from "../middlewares/authorization.middleware";
import {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controllers";
import {
  createProductValidator,
  getSingleProductValidator,
  updateProductValidator,
  deleteProductValidator,
} from "../validators/product.validator";

const router = Router();
router.use(authentication);

router
  .route("/")
  .get(getAllProducts as RequestHandler)
  .post(
    authorization("admin", "manager"),
    createProductValidator,
    createProduct as RequestHandler
  );

router
  .route("/:id")
  .get(getSingleProductValidator, getSingleProduct as RequestHandler)
  .put(
    authorization("admin", "manager"),
    updateProductValidator,
    updateProduct as RequestHandler
  )
  .delete(
    authorization("admin"),
    deleteProductValidator,
    deleteProduct as RequestHandler
  );

export default router;
