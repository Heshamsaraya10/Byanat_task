    import { RequestHandler, Router } from "express";
    import { authentication } from "../middlewares/authentication.middleware";
    import { authorization } from "../middlewares/authorization.middleware";
    import {
    createCashOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
    } from "../controllers/order.controllers";

    const router = Router();
    router.use(authentication, authorization("user"));

    router.route("/:cartId").post(createCashOrder);

    router.put("/:id/pay", authorization("admin", "manager"), updateOrderToPaid);
    router.put(
    "/:id/deliver",
    authorization("admin", "manager"),
    updateOrderToDelivered
    );

    export default router;
