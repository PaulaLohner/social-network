DROP TABLE IF EXISTS chat_messages;


CREATE TABLE chat_messages(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) NOT NULL,
    message VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chat_messages (user_id, message) VALUES (201, 'hi there! first message in the chat!'),(195, 'second!'),(7, 'third time is a charm!');


