BEGIN TRANSACTION;

INSERT INTO users (name, email, age, occupation, entries, joined) values ('test', 'test@gmail.com', 22, 'Student', 5, '2020-01-01');
INSERT INTO login (hash, email) values ('$2a$10$wFcjzlpahcY0M8vJ9y5zSe4/o48pA5Ap2L.U359PMHdl6oLFmo4.K', 'test@gmail.com');

COMMIT;