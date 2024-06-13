    import { Router } from "express";
    import { authentication } from "../middlewares/authentication.middleware";
    import { authorization } from "../middlewares/authorization.middleware";
    import {
    addProductToCart,
    getLoggedUserCart,
    removeSpecificCartItem,
    clearCart,
    updateCartItemQuantity,
    } from "../controllers/cart.controllers";
    const router = Router();
    router.use(authentication, authorization("user"));

    router
    .route("/")
    .post(authentication, addProductToCart)
    .get(getLoggedUserCart)
    .delete(clearCart);
    router
    .route("/:itemId")
    .put(updateCartItemQuantity)
    .delete(removeSpecificCartItem);

    export default router;
