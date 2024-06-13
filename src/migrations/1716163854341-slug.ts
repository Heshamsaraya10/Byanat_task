import { MigrationInterface, QueryRunner } from "typeorm";

export class Slug1716163854341 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "users"
        ADD COLUMN "slug" VARCHAR
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    ALTER TABLE "users"
    DROP COLUMN "slug"
  `);
  }
}
