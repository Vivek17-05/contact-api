import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1739102012857 implements MigrationInterface {
    name = 'Init1739102012857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contact_linkprecedence_enum" AS ENUM('primary', 'secondary')`);
        await queryRunner.query(`CREATE TABLE "contact" ("id" SERIAL NOT NULL, "phoneNumber" character varying, "email" character varying, "linkedId" integer, "linkPrecedence" "public"."contact_linkprecedence_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TYPE "public"."contact_linkprecedence_enum"`);
    }

}
