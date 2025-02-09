import { DataSource } from "typeorm";
import path from "path";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: "postgresql://db0_l1ar_user:AutakAnDPZc0IWJSV2XRpduYNnGeDc0s@dpg-cuk97tlumphs73bbiovg-a.oregon-postgres.render.com/db0_l1ar", 
    synchronize: false, // Set to false in production, use migrations instead
    logging: true,
    entities: ["src/entities/*.ts"],
    migrations: ["src/migrations/*.ts"],
    ssl: { rejectUnauthorized: false } , 
});