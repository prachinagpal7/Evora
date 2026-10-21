//here we will configure the neon database connection

import {neon} from '@neondatabase/serverless';    /*neon is a cloud postgreSQL (serverless), like mongoDB atlas, but for SQL*/

const sql = neon(`${process.env.DATABASE_URL}`);    /*it creates query function ie function to run sql queries on database*/

export default sql;