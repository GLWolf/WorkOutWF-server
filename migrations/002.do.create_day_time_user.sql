CREATE TABLE day_time_user (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  day_id INTEGER,
  time_id INTEGER,
  date_created TIMESTAMP NOT NULL DEFAULT now(),
  date_modified TIMESTAMP
);