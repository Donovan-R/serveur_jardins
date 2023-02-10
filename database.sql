CREATE DATABASE jardins_autour;

/*création des relations avec users*/

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  lastname VARCHAR(50) NOT NULL, 
  firstname VARCHAR(50) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  justificatif TEXT NOT NULL,
  comments TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  CHECK (char_length(firstname) >= 1 AND char_length(firstname) <= 50),
  CHECK (char_length(lastname) >=1 AND char_length(lastname)<=50),
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

-- CREATE TABLE roles(
--   role_id SERIAL PRIMARY KEY,
--   name VARCHAR(30) DEFAULT ('user')
-- )




/* création des relations pour les plantations */

CREATE TABLE plants(
    plant_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    img VARCHAR(255) NOT NULL,
    plantation_start VARCHAR (20) , 
    plantation_fin VARCHAR (20),
    recolte_start VARCHAR(20),
    UNIQUE (name)
);

CREATE TABLE plants_details(
  plants_details SERIAL PRIMARY KEY,
  plant_id INTEGER REFERENCES plants(plant_id) ON DELETE CASCADE NOT NULL,
  semis_abri_start VARCHAR (20),
  semis_abri_fin VARCHAR (20),
  semis_terre_start VARCHAR (20),
  semis_terre_fin VARCHAR (20),
  recolte_fin VARCHAR (20),
  plantation_details TEXT,
  culture TEXT,
  friends_plants TEXT,
  ennemy_plants TEXT,
  rotation_cultures VARCHAR (255)
)

