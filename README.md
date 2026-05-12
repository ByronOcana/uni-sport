# Circuit Breaker

Debido a que en el gateway se hace uso de dos servicios `/mascotas` y `/usuarios` para almacenar el contador de errores y el estado de abierto o cerrado se implemento usando un diccionario

![](evidencia/contador_errores.png)

De igual forma se separaron los servicios en funciones aparte y fuera de los endpoint para evitar la repetición de código del manejo de errores, ya que todos devuelve la misma información

## Codigo Explicado

Para los servicios de `/mascotas` y `/usuarios` se usaron las misma lógica para el Circuit Breaker:

Al inicio de cada try hay un condicional que en cado de que se defina break como true, pone en suspendió el servicio.

![](evidencia/condicional_break.png)

Si al hacer una petición a la servicio de `/usuarios` responde correctamente el contador de errores se restablece a cero para próximas peticiones.

![](evidencia/try_usuarios.png)

En el caso en el que el servicio falle se incrementa el contador de intentos y en caso de llegar al limite de 3 intentos el establece break a true para suspender el servicios. También lanza algunos logs que aparecen en la terminal dentro de docker.

Codigo:

![](evidencia/except_usuarios.png)

Logs:

![](evidencia/logs_gateway.png)

En caso de que el servicios falle las primeras 2 veces se lanza un mensaje en el que se informa que algo salió mal y que podrías volver a intentar para obtener la información.

![](evidencia/resultado_gateway.png)

Pero en caso de que este termine los intentos se le informa que el servicio fue temporalmente suspendido

![](evidencia/servicio_suspendido.png)

![](evidencia/servicio_suspendido_2.png)

## Codigo Completo

Usuarios:

![](evidencia/endpoint_usuarios.png)

Mascotas:

![](evidencia/endpoint_mascotas.png)

Endpoints:

![](evidencia/todos_los_endpoints.png)

## Preguntas
