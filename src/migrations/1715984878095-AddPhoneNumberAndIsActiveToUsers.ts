import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneNumberAndIsActiveToUsers1684412345679
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD  "phoneNumber" character varying,
      ADD "isActive" boolean NOT NULL DEFAULT true;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "phoneNumber",
      DROP COLUMN "isActive";
    `);
  }
}
