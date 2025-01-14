// importar conexion a la base de datos
const connection = require('./database/connection');

// importar depencinas
const express = require('express');
const cors = require('cors');

// mensaje de bienvenida
console.log('Bienvenido a la API de Musica');

// ejecutar conexion a la bd
connection();

// crear servidor de node
const app = express(); 
const port = 3910; 

// configurar cors
app.use(cors());

// convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cargar configuracion de rutas

// ruta de prueba
app.get('/ruta-probando', (req, res) => {
   return res.status(200).send('API de Musica');
});

// poner el servidor a escuchar las peticiones http
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});