DROP TABLE IF EXISTS person;
CREATE TABLE IF NOT EXISTS person (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(200),
    password VARCHAR(255)
);
CREATE UNIQUE INDEX email_idx ON person (email);
-- https://www.postgresql.org/docs/9.5/static/sql-createindex.html
-- https://stackoverflow.com/questions/23542794/postgres-unique-constraint-vs-index