import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  DeepPartial,
} from "typeorm";

import { User } from "./User.entity";
import { Product } from "./Product.entity";
import { Order } from "./Order.entity";

@Entity({ name: "cart_item" })
export class CartItem {
  static cart: DeepPartial<CartItem[]>;
  static map(
    arg0: (item: any) => {
      filter: { _id: any };
      update: { quantity: () => string; sold: () => string };
    }
  ) {
    throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  color: string;

  @Column({ type: "float" })
  price: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;

  @ManyToOne(() => Order, (order) => order.cartItems)
  order: Order;
}

@Entity({ name: "cart" })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  cartItems: CartItem[];


  @Column({ type: "float", nullable: true })
  totalCartPrice: number;

  @Column({ type: "float", nullable: true })
  totalPriceAfterDiscount: number;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: "userId" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
