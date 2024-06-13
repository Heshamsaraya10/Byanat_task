import { MigrationInterface, QueryRunner } from "typeorm";

export class User1716126171734 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD "profileImg" character varying,
      ADD "passwordChangedAt" TIMESTAMP NOT NULL DEFAULT now(),
      ADD "passwordResetCode" character varying,
      ADD "passwordResetExpires" TIMESTAMP NOT NULL DEFAULT now(),
      ADD "passwordResetVerified" boolean,
      ADD "active" boolean NOT NULL DEFAULT true
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    ALTER TABLE "users"
    DROP COLUMN "active";
  `);
  }
}
