DROP TABLE IF EXISTS equipos_evento;
DROP TABLE IF EXISTS eventos;

CREATE TABLE IF NOT EXISTS eventos (
    id          INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombre      TEXT NOT NULL,
    deporte     TEXT NOT NULL,
    tipo_evento TEXT NOT NULL,
    fecha       DATETIME NOT NULL,
    lugar       TEXT NOT NULL,
    estado      VARCHAR(20) DEFAULT 'proximo',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS equipos_evento (
    id          INTEGER PRIMARY KEY AUTO_INCREMENT,
    id_evento   INTEGER NOT NULL,
    nombre      TEXT NOT NULL,
    FOREIGN KEY (id_evento) REFERENCES eventos(id)
);

INSERT INTO eventos 
(nombre, deporte, tipo_evento, fecha, lugar, estado)
VALUES

(
'Copa Universitaria',
'Fútbol',
'Semifinal',
'2026-06-15 18:00:00',
'Coliseo La Estancia Popayán',
'en vivo'
),

(
'Torneo Interuniversitario de Baloncesto',
'Baloncesto',
'Final',
'2026-06-16 20:00:00',
'Gimnasio Universitario del Cauca',
'proximo'
),

(
'Campeonato Universitario de Atletismo',
'Atletismo',
'Clasificatoria',
'2026-06-17 09:00:00',
'Estadio Pascual Guerrero',
'proximo'
),

(
'Torneo Universitario de Voleibol',
'Voleibol',
'Cuartos de final',
'2026-06-20 15:00:00',
'Coliseo Mayor',
'finalizado'
),

(
'Copa Interuniversitaria de Natación',
'Natación',
'Final',
'2026-06-22 10:00:00',
'Complejo Deportivo La Villa',
'proximo'
),

(
'Campeonato de Ajedrez Universitario',
'Ajedrez',
'Eliminatoria',
'2026-06-25 08:00:00',
'Auditorio Universidad del Cauca',
'en vivo'
),

(
'Liga Universitaria de Fútbol Sala',
'Fútbol Sala',
'Fase de grupos',
'2026-06-27 14:00:00',
'Cancha Sintética Norte',
'proximo'
),

(
'Torneo Relámpago de Tenis',
'Tennis',
'Final',
'2026-06-28 11:00:00',
'Club Campestre Popayán',
'proximo'
),

(
'Campeonato Regional de Rugby',
'Rugby',
'Semifinal',
'2026-06-29 16:00:00',
'Estadio Ciro López',
'en vivo'
),

(
'Encuentro Universitario de Beisbol',
'Beisbol',
'Exhibición',
'2026-07-01 13:00:00',
'Diamante Deportivo Popayán',
'proximo'
);
INSERT INTO equipos_evento (id_evento, nombre) VALUES
(1, 'Unicauca'),
(1, 'UniValle'),

(2, 'Unicomfacauca'),
(2, 'Colegio Mayor'),

(3, 'Unicauca'),
(3, 'UniValle'),
(3, 'Unicomfacauca'),

(4, 'Colegio Mayor'),
(4, 'Unicauca'),

(5, 'UniValle'),
(5, 'Colegio Mayor'),

(6, 'Unicomfacauca'),
(6, 'Unicauca'),

(7, 'UniAmazonia'),
(7, 'Unicauca'),

(8, 'UniValle'),
(8, 'SENA'),

(9, 'Unicauca'),
(9, 'ESAP'),

(10, 'Colegio Mayor'),
(10, 'Unicomfacauca');