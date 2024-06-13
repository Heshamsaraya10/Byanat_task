import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import { CartItem } from "./Cart.entity";

@Entity({ name: "products" })
export class Product {
  static bulkWrite(bulkOption: { updateOne: { filter: { _id: Product; }; update: { $inc: { quantity: number; sold: number; }; }; }; }[], arg1: {}) {
      throw new Error("Method not implemented.");
  }
  static title: any;
  static quantity: any;
  cartItems: any;
  Cart: any;
  static findById(id: any) {
    throw new Error("Method not implemented.");
  }
  static findByIdAndUpdate(
    id: any,
    arg1: { password: string; passwordChangedAt: number },
    arg2: { new: boolean }
  ) {
    throw new Error("Method not implemented.");
  }
  static findOne(arg0: { email: string }) {
    throw new Error("Method not implemented.");
  }

  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 100 })
  title: string;

  @Column({ type: "varchar", unique: true })
  slug: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "int", default: 0 })
  sold: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  priceAfterDiscount: number;

  @Column()
  imageCover: string;

  @Column("simple-array", { nullable: true })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cart_Items: CartItem[];
}
