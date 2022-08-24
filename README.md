# Acerca de mi 
[Perfil](https://github.com/pabloMoron/profile)

# Ejercicio práctico en Node + Express
Una API REST que busca y consulta descripción de artículos desde la API de MercadoLibre o devuelve datos mockeados según el token incluído en las requests.

Se utiliza un esquema de seguridad tipo API KEY con un header X-Auth-Token.

Sólo hay dos (2) tokens válidos que sirven para identificar el origen de los datos.

# Dependencias
El proyecto se ejecuta bajo el SO Windows 10

Node v14.18

Se puede instalar desde el sitio oficial de [node](https://nodejs.org/)


Compatible con la version 16.17.0

# Entregable
## Instrucciones para ejecutar la API
Abrir una terminal de comandos en el directorio del proyecto y ejecutar los siguientes comandos:

<pre>
npm install
npm start
</pre>

## Documentación de endpoints
La documentación de las API puede ser consultada desde la aplicación una vez levantado el proceso servidor en la ruta [/api/swagger](http://localhost:9000/api/swagger)

Token para datos mockeados:

<b> 55a4639f-55e8-4e14-a6cc-b79977b20a4e </b>

Token para consultar la API de MercadoLibre:

<b> e962f81a-4d42-4eb3-86cd-a25e7237c8dc </b>

## Diagramas de secuencia
Los archivos se encuentran en el directorio raíz del repositorio, con los nombres <b>secuencia_items.pdf</b> y <b>secuencia_search.pdf</b>

## Tests

Para ejecutar los test ejecutar el seguiente comando
<pre>
npm test
</pre>

El comando creará el directorio <b>coverage</b> el informe de la cobertura de los tests