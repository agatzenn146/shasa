-- Admin Users
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Events
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    evdate DATE,
    time TIME,
    image VARCHAR(255)
);

-- Messages
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    message TEXT
);

-- Videos
CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    url VARCHAR(255),
    description TEXT
);

-- Executives
CREATE TABLE executives (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100),
    bio TEXT,
    image VARCHAR(255)
);

-- Gallery
CREATE TABLE gallery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    image_url VARCHAR(255),
    description TEXT
);

-- Sample Inserts
INSERT INTO admin_users (username, password) VALUES
('admin', 'password123');

INSERT INTO events (name, description, evdate, time, image) VALUES
('Event 1', 'Description of event 1', '2026-02-25', '10:00:00', 'event1.jpg');

INSERT INTO messages (name, email, message) VALUES
('John Doe', 'john@example.com', 'Hello!');

INSERT INTO videos (title, url, description) VALUES
('Video 1', 'https://example.com/video1', 'Description of video 1');

INSERT INTO executives (name, position, bio, image) VALUES
('Jane Smith', 'CEO', 'Bio of CEO', 'jane.jpg');

INSERT INTO gallery (title, image_url, description) VALUES
('Gallery 1', 'gallery1.jpg', 'Description of gallery 1');