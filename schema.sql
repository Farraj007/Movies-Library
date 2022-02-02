DROP TABLE IF EXISTS  favormovies ;

CREATE TABLE IF NOT EXISTS favormovies (
id SERIAL PRIMARY KEY,
title VARCHAR(255),
release_date VARCHAR(255),
poster_path VARCHAR(10000),
overview VARCHAR(100000)
);