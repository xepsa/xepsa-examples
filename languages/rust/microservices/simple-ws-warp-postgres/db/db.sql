
CREATE TABLE IF NOT EXISTS todo
(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255),
    created_at timestamp with time zone DEFAULT (now() at time zone 'utc'),
    checked boolean DEFAULT false
);

-- CREATE TABLE IF NOT EXISTS user_ident
-- (
--     id SERIAL PRIMARY KEY NOT NULL,
--     first_name VARCHAR(32),
--     last_name VARCHAR(32),
--     user_name VARCHAR(64),
--     secret_key VARCHAR(1024),
--     created_at timestamp with time zone DEFAULT (now() at time zone 'utc')
-- );