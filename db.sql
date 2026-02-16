-- ===========================================
-- Shasa Project Database Setup
-- ===========================================

-- 1️⃣ Create database
CREATE DATABASE IF NOT EXISTS shasa_db;
USE shasa_db;

-- ===========================================
-- 2️⃣ Admin Users Table
-- ===========================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample admin user
-- Passwords should be hashed using bcrypt in Node.js
-- Example hashed password for 'admin123': $2b$10$CwTycUXWue0Thq9StjUM0uJ8pK5eJdH.Mq3gR2/Jw5y7E/Zj8aF1K
INSERT INTO admin_users (username, password) VALUES
('admin', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8pK5eJdH.Mq3gR2/Jw5y7E/Zj8aF1K');

-- ===========================================
-- 3️⃣ Events Table
-- ===========================================
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    evdate DATE,
    time TIME,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Event
INSERT INTO events (name, description, evdate, time, image) VALUES
('Welcome Gathering', 'Annual welcome event for students', '2026-02-01', '10:00:00', 'welcome.jpg');

-- ===========================================
-- 4️⃣ Messages Table
-- ===========================================
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample message
INSERT INTO messages (name, email, message) VALUES
('Jane Doe', 'jane@example.com', 'Hello, I want to join the next event!');

-- ===========================================
-- 5️⃣ Videos Table
-- ===========================================
CREATE TABLE IF NOT EXISTS videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample video
INSERT INTO videos (title, url, description) VALUES
('Shasa Introduction', 'https://www.youtube.com/embed/kGaFCx7L2GY', 'Introduction to Shasa ministry');
