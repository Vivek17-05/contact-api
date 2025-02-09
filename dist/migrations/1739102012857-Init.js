"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Init1739102012857 = void 0;
class Init1739102012857 {
    constructor() {
        this.name = 'Init1739102012857';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TYPE "public"."contact_linkprecedence_enum" AS ENUM('primary', 'secondary')`);
            yield queryRunner.query(`CREATE TABLE "contact" ("id" SERIAL NOT NULL, "phoneNumber" character varying, "email" character varying, "linkedId" integer, "linkPrecedence" "public"."contact_linkprecedence_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE "contact"`);
            yield queryRunner.query(`DROP TYPE "public"."contact_linkprecedence_enum"`);
        });
    }
}
exports.Init1739102012857 = Init1739102012857;
