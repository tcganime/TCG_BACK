import { Pool } from 'pg';

class DB {
    pool = new Pool({
        user: 'anime_magic',
        host: 'localhost',
        database: 'postgres',
        password: 'anime_magic',
        port: 5432,
    })

    constructor() {
        console.log('DB instance created')
    }

    createUserTable() {        
        this.pool.query(
            `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP NOT NULL,
                updated_at TIMESTAMP NOT NULL,
                admin BOOLEAN NOT NULL DEFAULT FALSE,
                victories INTEGER NOT NULL DEFAULT 0,
                defeats INTEGER NOT NULL DEFAULT 0,
                UNIQUE (username, email)
            )`,
            (err: Error) => {
                if (err)
                    console.log(err.stack);
                else
                    console.log('Users table created');
            }
        );
    }

    init() {
        this.createUserTable();
    }
}

export default new DB();