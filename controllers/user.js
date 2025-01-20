// importar modulos
const User = require("../models/users");
const validate = require("../helper/validate");
const bcrypt = require("bcrypt");
const mongoosePaginate = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");

// modulo de prueba
const prueba = (req, res) => {
  return res.status(200).send("Modulo de prueba User");
};

// registrar usuario
const register = async (req, res) => {
    const params = req.body;
    const password = params.password;
  
    if (!params.email || !params.nick || !password) {
      return res.status(400).send({ error: "Faltan parámetros necesarios" });
    }
  
    try {
      const users = await User.find({
        $or: [{ email: params.email }, { nick: params.nick }],
      });
  
      if (users && users.length >= 1) {
        return res.status(400).send({ error: "El usuario ya existe" });
      } else {
        // cifrar contraseña
        let pwd = await bcrypt.hash(password, 10);
        params.password = pwd; // Asegúrate de actualizar params.password
  
        // crear objeto de usuario
        let user_to_save = new User(params);
  
        // guardar en base datos
        const userStores = await user_to_save.save();

        // Eliminar la propiedad password del objeto userStores
        let userCreated = userStores.toObject();
        delete userCreated.password;
        delete userCreated.role;
  
        // Devolver resultado
        return res.status(200).send({
          status: "success",
          message: "Usuario registrado correctamente",
          user: userCreated,
        });
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error); // Agregar más detalles al mensaje de error
      return res.status(500).send({ error: "Error al registrar usuario" });
    }
  };

module.exports = {
  prueba,
  register,
};
