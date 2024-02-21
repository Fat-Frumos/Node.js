CREATE TABLE IF NOT EXISTS users
(
    id       VARCHAR(36) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    age      INT          NOT NULL,
    hobby_id VARCHAR(36),
    FOREIGN KEY (hobby_id) REFERENCES hobbies (id)
);

CREATE TABLE IF NOT EXISTS hobbies
(
    id      VARCHAR(36) PRIMARY KEY,
    name    VARCHAR(255) NOT NULL,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE user_hobby
(
    user_id  INT,
    hobby_id INT,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (hobby_id) REFERENCES hobbies (id),
    PRIMARY KEY (user_id, hobby_id)
);
