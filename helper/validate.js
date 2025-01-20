const validator = require("validator");

const validate = (params) => {
  let resultado = false;
  let name =
    !validator.isEmpty(params.name) &&
    /^[A-Za-z\s]+$/.test(params.name) &&
    validator.isLength(params.name, { min: 3, max: 255 });
  let nick =
    !validator.isEmpty(params.nick) &&
    validator.isAlphanumeric(params.nick, "es-ES") &&
    validator.isLength(params.nick, { min: 3, max: 60 });
  let email =
    !validator.isEmpty(params.email) && validator.isEmail(params.email);
  let password = !validator.isEmpty(params.password);

  if (params.surname) {
    let surname =
      !validator.isEmpty(params.surname) &&
      /^[A-Za-z\s]+$/.test(params.surname) &&
      validator.isLength(params.surname, { min: 3, max: 255 });
    if (!surname) {
      throw new Error("No se asuperado la validacion en el apellido");
    } else {
      console.log("Validacion superada en el apellido");
    }
  }
  if (!name || !nick || !email || !password) {
    throw new Error("No se ha superado la validacion");
    resultado = false
  } else {
    console.log("Validacion superada");
    resultado = true;
  }
  return resultado;
};

module.exports = validate;