import { DataSource } from "typeorm";
import { Contact } from "../entities/Contact";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: "postgresql://db0_l1ar_user:AutakAnDPZc0IWJSV2XRpduYNnGeDc0s@dpg-cuk97tlumphs73bbiovg-a.oregon-postgres.render.com/db0_l1ar", 
    synchronize: false,
    logging: true,
    entities: [Contact],
    migrations: ["src/migrations/*.js"],
    ssl: { rejectUnauthorized: false }
});