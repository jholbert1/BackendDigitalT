'use strict'
const User = use('App/Models/User');
const Env = use("Env");
const KEY = Env.get("ENCRYPT_KEY");
const CryptoJS = require("crypto-js");

class AuthController {
    async login({ request, response, auth }) {
        try {
            const validation = await User.validateLogin(request.all());
            if (validation.fails()) {
                return response.status(422).send({
                    errors: validation.messages(),
                });
            }

            const { email, password } = request.all();

            const userData = await User.query()
                .where("email", email)
                .with("roles")
                .first();

            if (userData == null) {
                throw Error("No se encuentran registros");
            } else if (userData.is_active == false) {
                throw Error("Debe Validar su cuenta para ingresar");
            }

            const bytes = CryptoJS.AES.decrypt(password, KEY);

            const passwordDescrypt = bytes.toString(CryptoJS.enc.Utf8);

            const tokenData = await auth.attempt(email, passwordDescrypt);

            return response.status(200).json({
                message: "Bienvenido",
                data: {
                    user: userData,
                    access_token: tokenData,
                },
            });

        } catch (error) {
            return response
                .status(error.status === undefined ? 400 : error.status)
                .json({
                    error: {
                        message: "Error al ingresar",
                        details: "",
                        err_message: error.message,
                    },
                });
        }
    }

    async logout({ response, auth }) {
        try {
            const apiToken = auth.getAuthHeader();
            await auth.revokeTokens([apiToken])
            return response.status(200).json({
                data: null,
                message: "Se ha Deslogueado Sastifactoriamente",
            });

        } catch (error) {
            return response
                .status(error.status === undefined ? 400 : error.status)
                .json({
                    error: {
                        message: "Error al salir",
                        details: "",
                        err_message: error.message,
                    },
                });
        }
    }

    async authUser({ response, auth }) {
        try {
            const user = await auth.getUser();
            const myUser = await User.query()
                .where("id", user.id)
                .with("roles")
                .first();

            return response.status(200).json({
                data: myUser,
                message: "Usuario encontrado",
            });
        } catch (error) {
            return response
                .status(error.status === undefined ? 400 : error.status)
                .json({
                    error: {
                        message: "Error al obtener usuario logueado",
                        details: "",
                        err_message: error.message,
                    },
                });
        }
    }
}

module.exports = AuthController
