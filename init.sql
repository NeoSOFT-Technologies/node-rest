CREATE USER nest;

CREATE DATABASE IF NOT EXISTS rest_api;
CREATE USER 'user'@'%';
GRANT ALL PRIVILEGES ON rest_api.* TO 'user'@'%';
GRANT ALL PRIVILEGES ON rest_api.* TO 'nest'@'%';
