"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_1 = require("./db/db.config");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
db_config_1.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(3000, () => {
        console.log('Server running on port 3000');
        app.use('/identify', contactRoutes_1.default);
    });
})
    .catch((err) => console.error('Error during Data Source initialization', err));
// export { AppDataSource, app };
