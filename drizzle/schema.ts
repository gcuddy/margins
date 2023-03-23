import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, varchar, mediumtext, mysqlEnum, tinyint, json, int, double, uniqueIndex, text, longtext, primaryKey, bigint, tinytext, datetime, timestamp } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm/sql"

export const user = mysqlTable('user', {
    id: varchar('id', { length: 15 }),
    createdAt: timestamp('created_at', {
        fsp: 2
    }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', {
        fsp: 2
    }).notNull().defaultNow().onUpdateNow(),
    email: varchar('email', {
        length: 255
    }).notNull(),
    username: varchar('username', {
        length: 255
    }).notNull(),
})

// TODO
