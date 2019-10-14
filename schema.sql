-- DEVELOPMENT-- 
DROP DATABASE IF EXISTS passport;
CREATE DATABASE passport;
USE passport;

CREATE TABLE Spots(
id INT(11) AUTO_INCREMENT PRIMARY KEY,
owner VARCHAR (255),
car VARCHAR (255),
license VARCHAR (255),
email VARCHAR(255),
createdAt datetime,
updatedAt datetime
);
