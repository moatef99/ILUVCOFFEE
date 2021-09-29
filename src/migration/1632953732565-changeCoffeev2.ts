import {MigrationInterface, QueryRunner} from "typeorm";

export class changeCoffeev21632953732565 implements MigrationInterface {
    name = 'changeCoffeev21632953732565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."coffee" RENAME COLUMN "title" TO "homs"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."coffee" RENAME COLUMN "homs" TO "title"`);
    }

}
