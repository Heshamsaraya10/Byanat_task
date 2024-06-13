import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveId1716145626986 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE "users"
        DROP COLUMN "id"
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "id" VARCHAR
    `);
    }

}
