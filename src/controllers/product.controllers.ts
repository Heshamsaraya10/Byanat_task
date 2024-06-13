import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import slugify from "slugify";

import { Product } from "./../entity/Product.entity";
import APIError from "../utils/apiError";

//@dec    Create product
//@route  POST /api/v1/products
//@access private/Admin-Manager
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    title,
    quantity,
    price,
    priceAfterDiscount,
    description,
    imageCover,
    sold,
  } = req.body;

  const ProductRepository = AppDataSource.getRepository(Product);

  const product = new Product();
  product.title = title;
  product.slug = slugify(title, { lower: true });
  product.quantity = quantity;
  product.price = price;
  product.sold = sold;
  product.priceAfterDiscount = priceAfterDiscount;
  product.description = description;
  product.imageCover = imageCover;

  const createProduct = await ProductRepository.save(product);
  res.status(201).json({ status: "Success", data: createProduct });
};

// @dec    GET specific products by id
// @route  GET /api/v1/products/:id
// @access public
export const getSingleProduct = async (
  req: Request,
  res: Response<{ status: string; data: Product | null }>,
  next: NextFunction
) => {
  const ProductId = +req.params.id;

  const ProductRepository = AppDataSource.getRepository(Product);
  const product = await ProductRepository.findOne({
    where: { id: String(ProductId) },
  });
  if (!product)
    return next(new APIError("product is not exist or Invalid ID.", 404));
  res.status(200).json({ status: "Success", data: product });
};

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
export const getAllProducts = async (
  req: Request,
  res: Response<Product[]>,
  next: NextFunction
) => {
  const query = req.query;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const ProductRepository = AppDataSource.getRepository(Product);
  const allProduct = await ProductRepository.find({
    skip: skip,
    take: limit,
  });
  res.status(200).json(allProduct);
};

// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin-Manager
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ProductRepository = AppDataSource.getRepository(Product);
  const ProductId = req.params.id;

  const product = await ProductRepository.findOne({ where: { id: ProductId } });

  if (!product) {
    return next(new APIError(`No product for this id ${req.params.id}`, 404));
  }

  product.title = req.body.title;
  product.slug = slugify(req.body.slug || req.body.title, { lower: true });
  product.quantity = req.body.quantity;
  product.price = req.body.price;
  product.sold = req.body.sold;
  product.priceAfterDiscount = req.body.priceAfterDiscount;
  product.description = req.body.description;
  product.imageCover = req.body.imageCover;

  await ProductRepository.save(product);

  res.status(200).json({ data: product });
};

// @desc Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ProductRepository = AppDataSource.getRepository(Product);

  const ProductId = req.params.id;

  const product = await ProductRepository.findOne({ where: { id: ProductId } });

  if (!product) {
    return next(new APIError("product does not exist or Invalid ID.", 404));
  }

  await ProductRepository.remove(product);

  res.json(product);
};
