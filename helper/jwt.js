// importar dependencias  
const jwt = require("jwt-simple");
const moment = require("moment");// para crear y daler tiempos de expiracion

// clave secreta
const secret = "CLAVE_SECRETA";

// fuccion para crear token
const createToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    nick: user.nick,
    role: user.role,
    image: user.image,
    iat: moment().unix(), // fecha de creacion
    exp: moment().add(30, "days").unix(), // fecha de expiracion
  };

  return jwt.encode(payload, secret);
};

// exportar modulo
module.exports = {
  createToken,
  secret,
};
