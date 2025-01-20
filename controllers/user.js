// importar modulos
const User = require("../models/users");
const validate = require("../helper/validate");
const jwt = require("../helper/jwt");
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

// metodo de login

const login = async (req, res) => {
  // Recoger parametros de la petición
  const params = req.body;
  // comprobar que los parametros no estén vacíos
  if (!params.email || !params.password) {
    return res.status(400).send({ error: "Faltan parámetros necesarios" });
  }
  // Bucar en la BD si existe el email
  try {
    const user = await User.findOne({ email: params.email }).select(
      "+password +role"
    );
    // comprobar si existe el usuario
    if (!user) {
      return res.status(404).send({ error: "El usuario no existe" });
    }
    // comprobar la contraseña
    const pwd = await bcrypt.compareSync(params.password, user.password);
    if (!pwd) {
      return res.status(400).send({ error: "Login incorrecto" });
    }

    // Eliminar la propiedad password del objeto user
    let identityUser = user.toObject();
    delete identityUser.password;

    // conseguir token
    const token = jwt.createToken(user);

    return res.status(200).send({
      status: "success",
      message: "Método de login",
      user: identityUser,
      token: token,
    });
  } catch (error) {
    return res.status(500).send({ error: "esto esta muerto" });
  }
};

const profile = async (req, res) => {
  // Recoger el id de la url
  const userId = req.params.id;
  // consultar para sacar los datos del perfil
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: "El usuario no existe" });
    }
    return res.status(200).send({
      status: "success",
      message: "Método de profile",
      user: user,
    });
  } catch (error) {
    return res.status(500).send({ error: "esto esta muerto" });
  }
};

const update = async (req, res) => {
  // recorger los datos del usuario identificado
  let userIdentity = req.user;
  // recoger datos a actualizar
  let userToUpdate = req.body;

  // validar datos
  try {
    validate(userToUpdate)
  } catch (error) {
    return res.status(400).send({ error: "no cumples con la notacion adecuada" });
    
  }

  // comprobar si el usuario existe
  try {
    let users = await User.find({
      $or: [
        { email: userToUpdate.email.toLowerCase() },
        { nick: userToUpdate.nick.toLowerCase() },
      ],
    });
    if (!users) {
      return res.status(404).send({ error: "El usuario no existe" });
    }

    // comprobar si usuario existe y no soy yo mismo
    let user_isset = false;
    users.forEach((user) => {
      if (user && user._id != userIdentity.id) {
        user_isset = true;
      }
    });
    // si ya existe devuelvo una respuesta
    if (user_isset) {
      return res.status(404).send({ error: "El usuario ya existe" });
    }

    // cifrar contraseña
    if (userToUpdate.password) {
      let pwd = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = pwd; // Asegúrate de actualizar params.password
    } else {
      delete userToUpdate.password;
    }

    // buscar y actualizar documento
    let userUpdated = await User.findByIdAndUpdate(
      userIdentity.id,
      userToUpdate,
      { new: true }
    );
    return res.status(200).send({
      status: "success",
      message: "Método de update",
      user: userUpdated,
    });
  } catch (error) {
    return res.status(500).send({ error: "Error al actualizar usuario" });
  }
};

const upload = async (req, res) => {
  return res.status(200).send("Modulo de upload User");
}

module.exports = {
  prueba,
  register,
  login,
  profile,
  update,
};
