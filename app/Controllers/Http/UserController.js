'use strict'
const User = use('App/Models/User');
const Role = use('Adonis/Acl/Role');
const Mail = use('Mail');
const Env = use("Env");
const MAIL_USERNAME = Env.get("MAIL_USERNAME");
const URL_FRONT_APP = Env.get("URL_FRONT_APP");

class UserController {
    async index({ request, response, auth }) {
        try {
            const user = await auth.getUser();
            const userRole = await user.getRoles();

            const { page, per_page } = request.get();
            const querySet = User.query();
            const p = page || 1;
            const per = per_page || 20;
            let responseData;
            if (userRole[0] == 1000) {
                responseData = await querySet.with("roles").paginate(p, per);
            } else {
                responseData = await querySet.where('id', user.id).with("roles").fetch();
            }

            return response.status(200).json({
                message: "Operación exitosa",
                data: userRole[0] == 1000 ? responseData : { data: responseData },
            });
        } catch (error) {
            return response
                .status(error.status === undefined ? 400 : error.status)
                .json({
                    error: {
                        message: "Error cargando usuarios",
                        details: "",
                        err_message: error.message,
                    },
                });
        }
    }

    async show({ params, response }) {
        try {
            const user = await User.query()
                .where('id', params.id)
                .with("roles")
                .first();

            return response.status(200).json({
                message: "Operación exitosa",
                data: user,
            });
        } catch (error) {
            return response
                .status(error.status === undefined ? 400 : error.status)
                .json({
                    error: {
                        message: "Error al mostrar usuario",
                        details: "",
                        err_message: error.message,
                    },
                });
        }
    }

    async store({ request, response }) {
        try {
            const requestData = request.all();

            const validation = await User.validateCreate(requestData);

            if (validation.fails()) {
                return response.status(422).send({
                    errors: validation.messages(),
                });
            }

            const { role_id } = request.all();

            const roleFind = await Role.find(role_id == '2000' ? 2 : 1);
            const code = await User.makeCode(6);

            const instance = await User.create({
                email: requestData.email,
                names: requestData.names,
                last_names: requestData.last_names,
                phone: `+507 ${requestData.phone}`,
                address: requestData.address,
                birth_date: requestData.birth_date,
                password: requestData.password,
                code: code,
                is_active: false
            });

            const userFind = await User.find(instance.id)
            await userFind.roles().attach([roleFind.id])

            await this.sendEmail(code, requestData.email);

            return response.status(200).json({
                message: "Operación exitosa, se ha enviado un correo para que confirme su cuenta",
                data: {
                    ...instance.toJSON(),
                    roles: [roleFind]
                },
            });
        } catch (error) {
            return response
                .status(error.status === undefined ? 400 : error.status)
                .json({
                    error: {
                        message: "Error registrando usuarios",
                        details: "",
                        err_message: error.message,
                    },
                });
        }
    }

    async update({ params, response, request }) {
        try {
            const { email,
                names,
                last_names,
                phone,
                address,
                birth_date,
                password } = request.all();


            const validation = await User.validateUpdate(request.all(), params.id);

            if (validation.fails()) {
                return response.status(422).send({
                    errors: validation.messages(),
                });
            }
            const user = await User.findBy('id', params.id);
            user.email = email;
            user.names = names;
            user.last_names = last_names;
            user.phone = `+507 ${phone}`;
            user.address = address;
            user.birth_date = birth_date;
            user.password = password;
            await user.save();

            return response.status(200).json({
                message: "Operación exitosa",
                data: user,
            });
        } catch (error) {
            return response
                .status(error.status === undefined ? 400 : error.status)
                .json({
                    error: {
                        message: "Error al editar usuario",
                        details: "",
                        err_message: error.message,
                    },
                });
        }
    }

    async delete({ request, response }) {
        try {
            const deleteArray = request.all();

            const user = await User.query()
                .whereIn('id', deleteArray.deleteArray)
                .delete();

            return response.status(200).json({
                message: "Operación exitosa",
                data: user,
            });
        } catch (error) {
            return response
                .status(error.status === undefined ? 400 : error.status)
                .json({
                    error: {
                        message: "Error al eliminar usuario",
                        details: "",
                        err_message: error.message,
                    },
                });
        }
    }

    async active({ request, response }) {
        try {

            const { code } = request.all();
            const user = await User
                .query()
                .where('code', code)
                .update({ is_active: true });

            return response.status(200).json({
                message: "Operación exitosa",
                data: user,
            });
        } catch (error) {
            return response
                .status(error.status === undefined ? 400 : error.status)
                .json({
                    error: {
                        message: "Error al mostrar usuario",
                        details: "",
                        err_message: error.message,
                    },
                });
        }
    }

    async sendEmail(code, email) {
        await Mail.send(
            "emails.verify",
            { code: code, url: URL_FRONT_APP },
            (message) => {
                message
                    .to(email)
                    .from(MAIL_USERNAME)
                    .subject("Confirmar Cuenta");
            }
        );
    }
}

module.exports = UserController
