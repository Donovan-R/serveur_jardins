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
  role_id INTEGER REFERENCES roles(role_id) DEFAULT 1 NOT NULL,
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

CREATE TABLE roles(
  role_id SERIAL PRIMARY KEY,
  name VARCHAR(30)
)




/* création des relations pour les plantations */

CREATE TABLE plants(
    plant_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    img VARCHAR(255) NOT NULL,
    plantation_date_start DATE, 
    plantation_date_end DATE, 
    harvest_date_start DATE, 
    harvest_date_end DATE, 
    plantation_details TEXT,
    sowing_details TEXT,
    crop TEXT,
    crop_rotation VARCHAR (255),
    rows_spacing_in_cm INTEGER,
    plants_spacing_in_cm INTEGER,
    UNIQUE (name)
);


CREATE TABLE plants_friends(
  plant_id INTEGER REFERENCES plants(plant_id ) ON DELETE CASCADE NOT NULL,
  plant_friend_id INTEGER REFERENCES plants(plant_id) ON DELETE CASCADE NOT NULL,
  unique (plant_friend_id, plant_id)
)

CREATE TABLE plants_ennemies(
  plant_id INTEGER REFERENCES plants(plant_id ) ON DELETE CASCADE NOT NULL,
  plant_ennemy_id INTEGER REFERENCES plants(plant_id) ON DELETE CASCADE NOT NULL,
  unique (plant_ennemy_id, plant_id)
)

CREATE TABLE sowing_periods(
  plant_id INTEGER REFERENCES plants(plant_id) ON DELETE CASCADE NOT NULL,
  sowing_location_id INTEGER REFERENCES sowing_locations(sowing_location_id) ON DELETE CASCADE,
  sowing_date_start DATE NOT NULL,
  sowing_date_end DATE NOT NULL,
  unique (sowing_location_id, plant_id)
)

CREATE TABLE sowing_locations(
  sowing_location_id SERIAL PRIMARY KEY,
  name VARCHAR(20) NOT NULL
)

