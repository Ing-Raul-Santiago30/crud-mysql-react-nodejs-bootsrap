const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Crear la conexión
const db = mysql.createConnection({ 
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'empleados'
});


// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

// Ruta para crear un nuevo empleado
app.post('/create', (req, res) => {
    const { nombre, edad, pais, cargo, años } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || edad === undefined || !pais || !cargo || años === undefined) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    // Insertar datos en la base de datos
    db.query('INSERT INTO empleados (nombre, edad, pais, cargo, años) VALUES (?, ?, ?, ?, ?)', 
    [nombre, edad, pais, cargo, años],
    (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error al registrar el empleado');
        } 
        res.send('Empleado registrado con éxito');
    });
});

// Ruta para obtener todos los empleados
app.get('/empleados', (req, res) => {
    db.query('SELECT * FROM empleados', (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error al obtener empleados');
        }
        res.send(result);
    });
});

// Ruta para actualizar un empleado
app.put('/update', (req, res) => {
    const { id, nombre, edad, pais, cargo, años } = req.body;

    // Validar que todos los campos estén presentes
    if (!id || !nombre || edad === undefined || !pais || !cargo || años === undefined) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    // Actualizar datos en la base de datos
    db.query('UPDATE empleados SET nombre=?, edad=?, pais=?, cargo=?, años=? WHERE id=?', 
    [nombre, edad, pais, cargo, años, id],
    (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error al actualizar el empleado');
        } 
        res.send('Empleado actualizado con éxito');
    });
});

// Ruta para eliminar empleado
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    // Eliminar empleado de la base de datos
    db.query('DELETE FROM empleados WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al eliminar el empleado');
        }
        res.send('Empleado eliminado con éxito');
    });
});

// Otros endpoints y configuración de tu servidor aquí


// Iniciar el servidor
app.listen(3001, () => {
    console.log('Servidor corriendo en el puerto 3001');
});
