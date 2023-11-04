CREATE TABLE books(
    id SERIAL PRIMARY KEY,
    name TEXT,
    author TEXT,
    image TEXT,
    img_paths TEXT,
    rating FLOAT,
    currently_reading BOOLEAN,
    finished_reading BOOLEAN
);

CREATE TABLE notes(
    id SERIAL PRIMARY KEY,
    comment VARCHAR(255),
    book_id INTEGER REFERENCES book(id)
);
