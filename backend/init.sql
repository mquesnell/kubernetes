CREATE DATABASE toybox DEFAULT CHARACTER SET = 'utf8mb4';

USE toybox;

CREATE TABLE
    toys (
        id bigint NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name varchar(255)
    );

INSERT INTO toys (name)
VALUES ('blocks'), ('car'), ('doll'), ('Lego'), ('Barbie'), ('ball');