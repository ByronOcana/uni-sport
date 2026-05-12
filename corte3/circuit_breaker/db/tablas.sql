CREATE TABLE mascotas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    duenyo_id INT
);

INSERT INTO mascotas (nombre, tipo, duenyo_id) VALUES
('Luna', 'Perro', 1),
('Max', 'Gato', 1),
('Rocky', 'Perro', 2),
('Coco', 'Loro', 3),
('Simba', 'Gato', 2);