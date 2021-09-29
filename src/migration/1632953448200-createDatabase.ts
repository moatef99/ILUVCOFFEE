import {MigrationInterface, QueryRunner} from "typeorm";

export class createDatabase1632953448200 implements MigrationInterface {
    name = 'createDatabase1632953448200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flavor" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_934fe79b3d8131395c29a040ee5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coffee" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "brand" character varying NOT NULL, CONSTRAINT "PK_4d27239ee0b99a491ad806aec46" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coffee_flavor" ("coffeeId" integer NOT NULL, "flavorId" integer NOT NULL, CONSTRAINT "PK_beff5305e2cb1a1a62026d95b93" PRIMARY KEY ("coffeeId", "flavorId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fcb412d7dbe3f834999ceee741" ON "coffee_flavor" ("coffeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bd54e3fd4fe54470747f0f78c5" ON "coffee_flavor" ("flavorId") `);
        await queryRunner.query(`ALTER TABLE "coffee_flavor" ADD CONSTRAINT "FK_fcb412d7dbe3f834999ceee7413" FOREIGN KEY ("coffeeId") REFERENCES "coffee"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "coffee_flavor" ADD CONSTRAINT "FK_bd54e3fd4fe54470747f0f78c5c" FOREIGN KEY ("flavorId") REFERENCES "flavor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee_flavor" DROP CONSTRAINT "FK_bd54e3fd4fe54470747f0f78c5c"`);
        await queryRunner.query(`ALTER TABLE "coffee_flavor" DROP CONSTRAINT "FK_fcb412d7dbe3f834999ceee7413"`);
        await queryRunner.query(`DROP INDEX "IDX_bd54e3fd4fe54470747f0f78c5"`);
        await queryRunner.query(`DROP INDEX "IDX_fcb412d7dbe3f834999ceee741"`);
        await queryRunner.query(`DROP TABLE "coffee_flavor"`);
        await queryRunner.query(`DROP TABLE "coffee"`);
        await queryRunner.query(`DROP TABLE "flavor"`);
    }

}
