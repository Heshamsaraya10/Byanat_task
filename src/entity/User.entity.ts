import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import { Cart } from "./Cart.entity";
import { Order } from "./Order.entity";

@Entity({ name: "users" })
export class User {
  Cart: any;
  cart_items: any;
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

  @Column({ nullable: false })
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  profileImg: string;

  @Column({ type: "timestamp", nullable: true })
  passwordChangedAt: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  passwordResetCode: string;

  @Column({ type: "timestamp", nullable: true })
  passwordResetExpires: Date;

  @Column({ type: "boolean", nullable: true })
  passwordResetVerified: boolean;

  @Column({ type: "boolean", nullable: false, default: true })
  active: boolean;

  @Column({ default: "user" })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
