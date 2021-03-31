-- Author: Elias Peteri <elias.peteri@tuni.fi>
-- Date: 2021-03-31
-- File: create.sql
CREATE TABLE articles (
    userId INT,
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200),
    body VARCHAR(10000)
);
