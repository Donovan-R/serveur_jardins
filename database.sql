CREATE DATABASE  jardins_autour;

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  lastname VARCHAR(50) NOT NULL, 
  firstname VARCHAR(50) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  CHECK (char_length(firstname) >= 3 AND char_length(firstname) <= 50),
  CHECK (char_length(lastname) >=3 AND char_length(lastname)<=50),
  CHECK (char_length(mobile) >=3 AND char_length(mobile)<=20),
  CHECK (char_length(password) >= 6),
  UNIQUE (email)
);

CREATE TABLE tasks(
  task_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE NOT NULL
);