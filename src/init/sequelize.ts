import { Sequelize } from 'sequelize';

// sqlite database: ./anime.sqlite

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432, // Ensure the correct port is specified
    database: 'postgres',
    username: 'anime_magic',
    password: 'anime_magic',
});

export default sequelize;