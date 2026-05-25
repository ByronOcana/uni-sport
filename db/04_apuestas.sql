CREATE TABLE IF NOT EXISTS apuestas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    evento VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    cuota DECIMAL(6,2) NOT NULL,
    resultado VARCHAR(50),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO apuestas (usuario_id, evento, monto, cuota, resultado, fecha) VALUES
(1, 'Mundial 2026 - Argentina vs Brasil', 50.00, 2.10, 'ganada', '2026-05-15 14:30:00'),
(2, 'Champions League - Real Madrid vs Bayern', 100.00, 1.85, 'perdida', '2026-05-16 20:15:00'),
(1, 'NBA Final - Lakers vs Celtics', 75.50, 2.50, 'pendiente', '2026-05-17 18:00:00'),
(4, 'Tenis - Roland Garros Final', 30.00, 3.20, 'ganada', '2026-05-18 11:45:00'),
(1, 'Liga MX - América vs Chivas', 200.00, 1.95, 'perdida', '2026-05-19 21:00:00'),
(3, 'Fórmula 1 - Mónaco GP', 120.00, 2.30, 'ganada', '2026-05-20 09:30:00'),
(1, 'Boxeo - Pelea del Siglo', 500.00, 1.75, 'pendiente', '2026-05-21 22:00:00'),
(2, 'Eurocopa - España vs Francia', 45.00, 2.80, 'perdida', '2026-05-22 16:20:00'),
(5, 'Super Bowl LVII', 300.00, 1.60, 'ganada', '2026-05-23 23:45:00'),
(2, 'Torneo de Poker - Final Mesa', 80.00, 4.50, 'pendiente', '2026-05-24 19:00:00');