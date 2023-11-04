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


DELETE FROM books AS t1
USING books AS t2
WHERE t1.name = t2.name
  AND t1.author = t2.author
  AND t1.id > t2.id;
