import {MigrationInterface, QueryRunner} from "typeorm";

export class changeCoffee1632953581605 implements MigrationInterface {
    name = 'changeCoffee1632953581605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."coffee" RENAME COLUMN "name" TO "title"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."coffee" RENAME COLUMN "title" TO "name"`);
    }

}
