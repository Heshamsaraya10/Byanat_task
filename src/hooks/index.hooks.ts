import { Express } from "express-serve-static-core";

import userRouter from "../routes/user.routes";
import authRouter from "../routes/auth.routes";
import ProductRoute from "../routes/product.routes";
import cartRoute from "../routes/cart.routes";
import orderRoute from "../routes/order.routes";


const mountRoutes = (app: Express): void => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/products", ProductRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/orders", orderRoute);

};

export default mountRoutes;
