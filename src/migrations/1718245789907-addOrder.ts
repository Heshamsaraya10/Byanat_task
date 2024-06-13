import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrder1718245789907 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" SERIAL PRIMARY KEY,
                "userId" INTEGER NOT NULL,
                "cartItems" JSON NOT NULL,
                "taxPrice" FLOAT DEFAULT 0,
                "shippingAddress" JSON,
                "shippingPrice" FLOAT DEFAULT 0,
                "totalOrderPrice" FLOAT NOT NULL,
                "paymentMethodType" VARCHAR(255) DEFAULT 'cash',
                "isPaid" BOOLEAN DEFAULT false,
                "paidAt" TIMESTAMP,
                "isDelivered" BOOLEAN DEFAULT false,
                "deliveredAt" TIMESTAMP,
                "createdAt" TIMESTAMP DEFAULT now(),
                "updatedAt" TIMESTAMP DEFAULT now(),
                CONSTRAINT "FK_user_order" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "orders";
        `);
  }
}
