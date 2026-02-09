USE messaging_app;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE messages;
TRUNCATE TABLE conversation_participants;
TRUNCATE TABLE conversations;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- USERS (10 users)
INSERT INTO users (username, email, password_hash) VALUES
('alice',   'alice@example.com',   'hash_alice'),
('bob',     'bob@example.com',     'hash_bob'),
('charlie', 'charlie@example.com', 'hash_charlie'),
('diana',   'diana@example.com',   'hash_diana'),
('eric',    'eric@example.com',    'hash_eric'),
('frank',   'frank@example.com',   'hash_frank'),
('grace',   'grace@example.com',   'hash_grace'),
('helen',   'helen@example.com',   'hash_helen'),
('ivan',    'ivan@example.com',    'hash_ivan'),
('julia',   'julia@example.com',   'hash_julia');

-- CONVERSATIONS (5 total: private + group)
INSERT INTO conversations (type) VALUES
('private'),  -- id 1
('private'),  -- id 2
('group'),    -- id 3
('group'),    -- id 4
('private');  -- id 5

-- CONVERSATION PARTICIPANTS

-- Conversation 1 (private): alice & bob
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
(1, 1),
(1, 2);

-- Conversation 2 (private): charlie & diana
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
(2, 3),
(2, 4);

-- Conversation 3 (group): alice, bob, charlie
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
(3, 1),
(3, 2),
(3, 3);

-- Conversation 4 (group): diana, eric, frank, grace
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
(4, 4),
(4, 5),
(4, 6),
(4, 7);

-- Conversation 5 (private): ivan & julia
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
(5, 9),
(5, 10);

-- MESSAGES (~15 messages total)

-- Conversation 1
INSERT INTO messages (conversation_id, sender_id, content) VALUES
(1, 1, 'Hi Bob!'),
(1, 2, 'Hey Alice!'),
(1, 1, 'How is the project going?');

-- Conversation 2
INSERT INTO messages (conversation_id, sender_id, content) VALUES
(2, 3, 'Hi Diana'),
(2, 4, 'Hey Charlie, what’s up?'),
(2, 3, 'Just checking in.');

-- Conversation 3
INSERT INTO messages (conversation_id, sender_id, content) VALUES
(3, 1, 'Hello everyone'),
(3, 2, 'Hi Alice'),
(3, 3, 'Hey all'),
(3, 1, 'Let’s talk about the database');

-- Conversation 4
INSERT INTO messages (conversation_id, sender_id, content) VALUES
(4, 4, 'Group chat started'),
(4, 5, 'Hi all'),
(4, 6, 'Hello'),
(4, 7, 'Nice to meet you');

-- Conversation 5
INSERT INTO messages (conversation_id, sender_id, content) VALUES
(5, 9, 'Hi Julia'),
(5, 10, 'Hey Ivan');
