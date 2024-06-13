import { AppDataSource } from "./../data-source";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";

import { Product } from "../entity/Product.entity";
import { Cart, CartItem } from "../entity/Cart.entity";
import { User } from "../entity/User.entity";
import ApiError from "../utils/apiError";

const calcTotalCartPrice = (cartItems: CartItem[]): number => {
  return cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

//@dec    Add product to cart
//@route  GET /api/v1/cart
//@access private/User
export const addProductToCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.params.id;
    const { productId, color } = req.body;
    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({
      where: { id: productId },
    });

    // Get or create cart for logged user
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { id: userId } });

    const cartRepository = AppDataSource.getRepository(Cart);
    let cart = await cartRepository.findOne({ where: { user } });

    if (!cart) {
      //create cart for logged user with product
      cart = new Cart();
      cart.user = user;
      cart.cartItems = [];
    }
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.id === productId && item.color === color
    );
    //product exest in cart,update product quantity
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
    } else {
      //product not exest in cart, push product to cartItems array
      const cartItem = new CartItem();
      cartItem.product = product;
      cartItem.color = color;
      cartItem.price = product.price;
      cartItem.quantity = 1;
      cart.cartItems.push(cartItem);
    }
    //Calc totla cart price
    cart.totalCartPrice = calcTotalCartPrice(cart.cartItems);

    await cartRepository.save(cart);

    res.status(200).json({
      status: "success",
      message: "Product added to cart successfully",
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  }
);

//@dec    GET logged user cart
//@route  GET /api/v1/cart
//@access private/User
export const getLoggedUserCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cartRepository = AppDataSource.getRepository(Cart);

    const cart = await cartRepository.findOne({
      where: { user: req.user.id },
      relations: ["cartItems", "cartItems.product"],
    });

    if (!cart) {
      return next(
        new ApiError(`There is no cart for this user id: ${req.user.id}`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  }
);

//@dec    Remove specifc cart items
//@route  DELETE /api/v1/cart/:itemId
//@access private/User
export const removeSpecificCartItem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cartRepository = AppDataSource.getRepository(Cart);
    const cartItemRepository = AppDataSource.getRepository(CartItem);

    const cart = await cartRepository.findOne({
      where: { user: req.user.id },
      relations: ["cartItems"],
    });
    if (!cart) {
      return next(
        new ApiError(`There is no cart for this user id: ${req.user.id}`, 404)
      );
    }

    const cartItem = cart.cartItems.find(
      (item) => item.id === parseInt(req.params.itemId, 10)
    );

    if (!cartItem) {
      return next(
        new ApiError(`No cart item found with id: ${req.params.itemId}`, 404)
      );
    }

    await cartItemRepository.remove(cartItem);

    cart.cartItems = cart.cartItems.filter((item) => item.id !== cartItem.id);

    cart.totalCartPrice = calcTotalCartPrice(cart.cartItems);
    await cartRepository.save(cart);

    res.status(200).json({
      status: "success",
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  }
);

//@dec    Clear logged user cart
//@route  DELETE /api/v1/cart
//@access private/User
export const clearCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cartRepository = AppDataSource.getRepository(Cart);

    const result = await cartRepository.delete({ user: req.user.id });

    if (result.affected === 0) {
      return next(
        new ApiError(`No cart found for user id: ${req.user.id}`, 404)
      );
    }

    res.status(204).send();
  }
);

//@dec    Update specifc cart items quantity
//@route  PUT /api/v1/cart/:itemId
//@access private/User
export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cartRepository = AppDataSource.getRepository(Cart);
  const cartItemRepository = AppDataSource.getRepository(CartItem);

  const cart = await cartRepository.findOne({
    where: { user: req.user.id },
    relations: ["cartItems"],
  });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user: ${req.user.id}`, 404)
    );
  }

  const cartItem = cart.cartItems.find(
    (item) => item.id === parseInt(req.params.itemId, 10)
  );

  if (cartItem) {
    cartItem.quantity = quantity;
    await cartItemRepository.save(cartItem);
  } else {
    return next(
      new ApiError(`There is no item for this id: ${req.params.itemId}`, 404)
    );
  }

  cart.totalCartPrice = calcTotalCartPrice(cart.cartItems);
  await cartRepository.save(cart);

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
