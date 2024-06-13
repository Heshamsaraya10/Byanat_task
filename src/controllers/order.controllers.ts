import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import asyncHandler from "express-async-handler";

import { Product } from "../entity/Product.entity";
import { Cart, CartItem } from "../entity/Cart.entity";
import { User } from "../entity/User.entity";
import ApiError from "../utils/apiError";
import { Order } from "../entity/Order.entity";

declare module "express" {
  interface Request {
    filterObj?: {
      user: User;
    };
  }
}

//@dec    Create cash
//@route  POST /api/v1/orders/cartId
//@access Private/User
export const createCashOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const shippingPrice = 0;
    const taxPrice = 0;

    const cartRepository = AppDataSource.getRepository(Cart);
    const cartId = parseInt(req.params.cartId, 10);
    const cart = await cartRepository.findOne({
      where: { id: cartId },
      relations: ["orders"],
    });

    if (!cart) {
      return next(
        new ApiError(`There is no cart with id ${req.params.cartId}`, 404)
      );
    }

    const cartPrice = cart.totalPriceAfterDiscount ?? cart.totalCartPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    const userId = req.user?.id;
    if (!userId) {
      return next(new ApiError("User ID is missing from the request", 400));
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return next(new ApiError(`No user found with id ${userId}`, 404));
    }

    const orderRepository = AppDataSource.getRepository(Order);
    const order = orderRepository.create({
      user,
      cartItems: CartItem.cart,
      shippingAddress: req.body.shippingAddress,
      totalOrderPrice: totalOrderPrice,
      paymentMethodType: "cash",
    });

    await orderRepository.save(order);

    if (order) {
      const productRepository = AppDataSource.getRepository(Product);
      for (const item of cart.cartItems) {
        await productRepository.update(item.product.id, {
          quantity: () => `quantity - ${item.quantity}`,
          sold: () => `sold + ${item.quantity}`,
        });
      }

      await cartRepository.delete(cartId);
    }

    res.status(201).json({ status: "success", data: order });
  }
);

//@dec      Update order paid status to paied
//@route    PUT /api/v1/orders/:id/pay
//@access   Private/Admin-Manager
export const updateOrderToPaid = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = parseInt(req.params.id);

    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      return next(new Error(`There is no order with the id: ${orderId}`));
    }

    // Update order to paid
    order.isPaid = true;
    order.paidAt = new Date();

    const updatedOrder = await orderRepository.save(order);

    res.status(200).json({ status: "Success", data: updatedOrder });
  }
);

//@dec      Update order delivered status
//@route    PUT /api/v1/orders/:id/deliver
//@access   Private/Admin-Manager
export const updateOrderToDelivered = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        async (req: Request, res: Response, next: NextFunction) => {
        const orderId = parseInt(req.params.id);

        const orderRepository = AppDataSource.getRepository(Order);
        const order = await orderRepository.findOne({ where: { id: orderId } });

        if (!order) {
            return next(new Error(`There is no order with the id: ${orderId}`));
        }

        // Update order to delivered
        order.isDelivered = true;
        order.deliveredAt = new Date();

        const updatedOrder = await orderRepository.save(order);

        res.status(200).json({ status: "Success", data: updatedOrder });
        };
    }
);
