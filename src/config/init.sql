 src/config/init.sql (VERSIÓN CORREGIDA)
-- Solo mantén las sentencias de la tabla y datos
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO products (name, price) VALUES
('Laptop', 999.99),
('Smartphone', 699.99),
('Headphones', 149.99);