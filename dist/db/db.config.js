"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: "postgresql://db0_l1ar_user:AutakAnDPZc0IWJSV2XRpduYNnGeDc0s@dpg-cuk97tlumphs73bbiovg-a.oregon-postgres.render.com/db0_l1ar",
    synchronize: false,
    logging: true,
    entities: ["src/entities/*.js"],
    migrations: ["src/migrations/*.js"],
    ssl: { rejectUnauthorized: false }
});
