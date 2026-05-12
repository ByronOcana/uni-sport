## Fase 1 – Observar

![Fase 1](evidencias/fase1.png)

### ¿Qué hace el sistema actualmente?
Cuando el servicio de backend (Mascotas) está caído, el gateway intenta conectarse con un timeout de 2 segundos. Cada intento fallido incrementa el contador de fallos. Cuando llega a 3 fallos activa el circuito y deja de intentar conectarse, respondiendo directamente con "Servicio no disponible".

### ¿Se protege o insiste?
Se protege. Después de 3 fallos el circuito se abre y el gateway ya no intenta llamar al backend caído, evitando que el sistema quede bloqueado esperando respuestas que nunca llegan.

---

## Fase 2 – Aplicar

![Fase 2](evidencias/fase2.png)
![Fase 2 Usuarios](evidencias/fase2_usuarios.png)

### ¿Cada servicio debe tener su propio contador de fallos?
Sí, porque si fuera un contador unificado, un solo servicio caído abriría el circuito de todo el sistema dejando todos los demás endpoints sin funcionar.

### ¿El circuito debe abrirse de forma independiente por servicio?
Sí, si el circuito fuera compartido, la caída de usuarios bloquearía también las peticiones a mascotas aunque este funcionara perfectamente.

### ¿Qué pasa si falla un servicio pero el otro sigue funcionando?
El servicio caído abre su propio circuito y responde error inmediato, mientras el otro servicio sigue recibiendo y respondiendo peticiones normalmente. El sistema sigue funcionando parcialmente en vez de caerse todo.

---

## Fase 3 – Investigar (Half-Open)

![Fase 3](evidencias/fase3.png)

### ¿Qué significa "half-open"?
Es el estado intermedio del Circuit Breaker. Cuando el circuito lleva un tiempo abierto, pasa a Half-Open y deja pasar una sola petición de prueba para verificar si el servicio se recuperó.

### ¿Cuándo se vuelve a intentar una llamada?
Después de un tiempo de espera definido desde que el circuito se abrió. Pasado ese tiempo el circuito pasa a Half-Open y deja pasar una petición de prueba.

### ¿Qué pasa si el servicio vuelve a fallar?
Si falla vuelve a estado Abierto y espera otro intervalo de tiempo antes de intentar de nuevo.

---

## Fase 4 – Implementar

![Fase 4.1](evidencias/fase4.1.png)
![Fase 4.2](evidencias/fase4.2.png)
![Fase 4](evidencias/fase4.png)

---

## Fase 5 – Validar
