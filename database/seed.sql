USE messaging_app;

-- USERS
INSERT INTO users (username, email, password_hash)
VALUES
('alice', 'alice@example.com', 'hash_alice'),
('bob', 'bob@example.com', 'hash_bob'),
('charlie', 'charlie@example.com', 'hash_charlie');

-- CONVERSATIONS
INSERT INTO conversations (type)
VALUES
('private'),
('group');

-- CONVERSATION PARTICIPANTS
-- Private chat: Alice & Bob (conversation_id = 1)
INSERT INTO conversation_participants (conversation_id, user_id)
VALUES
(1, 1),
(1, 2);

-- Group chat: Alice, Bob, Charlie (conversation_id = 2)
INSERT INTO conversation_participants (conversation_id, user_id)
VALUES
(2, 1),
(2, 2),
(2, 3);

-- MESSAGES
INSERT INTO messages (conversation_id, sender_id, content)
VALUES
(1, 1, 'Hi Bob!'),
(1, 2, 'Hey Alice!'),
(2, 3, 'Hello everyone'),
(2, 1, 'Welcome to the group');
