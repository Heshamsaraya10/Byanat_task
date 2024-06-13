import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./User.entity";
import { Cart, CartItem } from "./Cart.entity";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.order, { cascade: true })
  cartItems: CartItem[];


  @Column({ type: "float", default: 0 })
  taxPrice: number;

  @Column("json", { nullable: true })
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
    postalCode: string;
  };

  @Column({ type: "float", default: 0 })
  shippingPrice: number;

  @Column({ type: "float" })
  totalOrderPrice: number;

  @Column({
    type: "enum",
    enum: ["cart", "cash"],
    default: "cash",
  })
  paymentMethodType: string;

  @Column({ type: "boolean", default: false })
  isPaid: boolean;

  @Column({ type: "timestamp", nullable: true })
  paidAt: Date;

  @Column({ type: "boolean", default: false })
  isDelivered: boolean;

  @Column({ type: "timestamp", nullable: true })
  deliveredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  order: Record<string, any>;
}
