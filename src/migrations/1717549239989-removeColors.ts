import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveColors1717549239989 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "products"
        DROP COLUMN "colors"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "products"
      ADD COLUMN "colors" VARCHAR
    `);
  }
}
