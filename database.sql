-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS products_db;

-- Switch to the newly created database
USE products_db;

-- Create a simple "products" table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
