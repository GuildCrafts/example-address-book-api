CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  birthday DATE,
  company VARCHAR(255)
);

CREATE TABLE groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE group_members (
  id SERIAL PRIMARY KEY,
  contact_id INTEGER REFERENCES contacts (id) NOT NULL,
  group_id INTEGER REFERENCES groups (id) NOT NULL
);
