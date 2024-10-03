import {
    text,
    timestamp,
    integer,
    boolean,
    pgTable,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    first_name: text("first_name"),
    last_name: text("last_name"),
    password_hash: text("password_hash").notNull()
});

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export const todo = pgTable("todo", {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    text: text("text").notNull(),
    done: boolean("done").default(false).notNull(),
});
