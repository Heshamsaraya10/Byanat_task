import { MigrationInterface, QueryRunner } from "typeorm";

export class CraeteProducstTable1717468214832 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "products" (
          "id" SERIAL NOT NULL,
          "title" character varying(100) NOT NULL,
          "slug" character varying NOT NULL UNIQUE,
          "description" text NOT NULL,
          "quantity" integer NOT NULL,
          "sold" integer NOT NULL DEFAULT 0,
          "price" decimal(10, 2) NOT NULL,
          "priceAfterDiscount" decimal(10, 2),
          "colors" text[] NOT NULL,
          "imageCover" character varying NOT NULL,
          "images" text[],
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        
        )
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products"`);
  }
}
