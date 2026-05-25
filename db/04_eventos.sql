CREATE TABLE IF NOT EXISTS eventos (
    id          INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombre      TEXT NOT NULL,
    deporte     TEXT NOT NULL,
    fecha       DATETIME NOT NULL,
    lugar       TEXT NOT NULL,
    estado      TEXT DEFAULT 'pendiente'
);

CREATE TABLE IF NOT EXISTS equipos_evento (
    id          INTEGER PRIMARY KEY AUTO_INCREMENT,
    id_evento   INTEGER NOT NULL,
    nombre      TEXT NOT NULL,
    FOREIGN KEY (id_evento) REFERENCES eventos(id)
);

INSERT INTO eventos (nombre, deporte, fecha, lugar) VALUES
('Copa Universitaria', 'Fútbol', '2026-06-15', 'Coliseo la estancia Popayán'),
('Torneo Interuniversitario de Baloncesto', 'Baloncesto', '2026-06-16', 'Gimnasio Universitario del cauca'),
('Campeonato Universitario de Atletismo', 'Atletismo', '2026-06-17', 'Pista de atletismo del estadio Pascual Guerrero');

INSERT INTO equipos_evento (id_evento, nombre) VALUES
(1, 'Unicauca'),
(1, 'UniValle'),
(2, 'Unicomfacauca'),
(2, 'Colegio mayor'),
(3, 'Unicauca'),
(3, 'UniValle'),
(3, 'Unicomfacauca'),
(3, 'Colegio mayor');