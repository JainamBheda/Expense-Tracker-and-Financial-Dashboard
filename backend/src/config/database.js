import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let cached;

export function initSequelize() {
    if (cached) return cached;
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: Number(process.env.DB_PORT || 3306),
        logging: false,
    });
    cached = sequelize;
    return sequelize;
}

export async function ensureDatabase() {
    // Connect without database to create it
    const tempSequelize = new Sequelize(null, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: Number(process.env.DB_PORT || 3306),
        logging: false,
    });
    
    try {
        await tempSequelize.authenticate();
        await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log('Database created/verified');
        await tempSequelize.close();
        
        // Now connect with database
        const sequelize = initSequelize();
        await sequelize.authenticate();
        return sequelize;
    } catch (error) {
        console.error('Database setup error:', error.message);
        throw error;
    }
}

export default initSequelize;

