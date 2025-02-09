import express from 'express';
import { DataSource } from 'typeorm';
import contactRouter from './routes/contactRoutes';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { AppDataSource } from './db/db.config';

dotenv.config();
const app = express();
app.use(bodyParser.json());




AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
        app.listen(3000, () => {
            console.log('Server running on port 3000');
            app.use('/identify', contactRouter);
        });
    })
    .catch((err) => console.error('Error during Data Source initialization', err));


// export { AppDataSource, app };