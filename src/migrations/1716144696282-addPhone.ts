import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhone1716144696282 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "users"
        ADD COLUMN "phone" VARCHAR
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    ALTER TABLE "users"
    DROP COLUMN "phone"
  `);
  }
}
