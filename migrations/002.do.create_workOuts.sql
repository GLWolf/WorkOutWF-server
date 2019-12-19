CREATE TABLE workOuts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  day_id TEXT NOT NULL,
  time_id INTEGER,
  date_created TIMESTAMP NOT NULL DEFAULT now(),
  date_modified TIMESTAMP
);