import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import apiRouter from './routes/api/index.js';
import { initSequelize } from './config/database.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

app.get('/', (_req, res) => {
    res.json({ status: 'ok', app: 'FinTrack Pro API' });
});

app.use('/api', apiRouter);

const PORT = process.env.PORT || 4000;

(async () => {
    const sequelize = initSequelize();
    try {
        await sequelize.authenticate();
        console.log('Database connected');
            app.listen(PORT, () => {
                console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('DB connection error:', err.message);
        process.exit(1);
    }
})();

