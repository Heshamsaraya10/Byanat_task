import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovePhoneNumberFromUsers1716144311954
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "users"
        DROP COLUMN "phoneNumber"
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "phoneNumber" VARCHAR
    `);
  }
}
