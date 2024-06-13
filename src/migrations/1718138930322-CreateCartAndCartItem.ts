    import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
    } from "typeorm";

    export class CreateCartAndCartItem1718138930322 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
        `CREATE TABLE "cart" (
                "id" SERIAL NOT NULL,
                "totalCartPrice" float, 
                "totalPriceAfterDiscount" float,
                "userId" int NOT NULL,
                "createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))
                `
        );
        await queryRunner.query(
        `ALTER TABLE "cart" 
            ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019"
            FOREIGN KEY ("userId") 
            REFERENCES "users"("id") ON DELETE CASCADE`
        );

        await queryRunner.createTable(
        new Table({
            name: "cart_item",
            columns: [
            {
                name: "id",
                type: "int",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment",
            },
            {
                name: "productId",
                type: "int",
            },
            {
                name: "cartId",
                type: "int",
            },
            {
                name: "quantity",
                type: "int",
                default: 1,
            },
            {
                name: "color",
                type: "varchar",
                length: "255",
                isNullable: true,
            },
            {
                name: "price",
                type: "float",
            },
            ],
        }),
        true
        );

        await queryRunner.createForeignKey(
        "cart_item",
        new TableForeignKey({
            columnNames: ["productId"],
            referencedColumnNames: ["id"],
            referencedTableName: "products", // <-- Corrected table name
            onDelete: "CASCADE",
        })
        );

        await queryRunner.createForeignKey(
        "cart_item",
        new TableForeignKey({
            columnNames: ["cartId"],
            referencedColumnNames: ["id"],
            referencedTableName: "cart",
            onDelete: "CASCADE",
        })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cart_item");
        await queryRunner.dropTable("cart");
    }
    }
