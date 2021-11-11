'use strict'
const Vehicle = use('App/Models/Vehicle');
const Status = use('App/Models/Status');

class VehicleController {
    async index({ request, response, auth }) {
        try {
            const user = await auth.getUser();
            const userRole = await user.getRoles();

            const { page, per_page } = request.get();
            const querySet = Vehicle.query();
            const p = page || 1;
            const per = per_page || 20;
            let responseData;
            if (userRole[0] == 1000) {
                responseData = await querySet.with("status").with('user.roles').paginate(p, per);
            } else {
                responseData = await querySet.where('user_id', user.id).with("status").fetch();
            }

            return response.status(200).json({
                message: "Operación exitosa",
                data: userRole[0] == 1000 ? responseData : { data: responseData },
            });
        } catch (error) {
            console.log(error);
        }
    }

    async store({ request, response, auth }) {
        try {
            const requestData = request.all();
            const user = await auth.getUser();

            const validation = await Vehicle.validateCreate(requestData);

            if (validation.fails()) {
                return response.status(422).send({
                    errors: validation.messages(),
                });
            }

            if (requestData.rental_from == requestData.rental_to) {
                throw Error("No se puede registrar fechas iguales");
            }

            const instance = await Vehicle.create({
                client: requestData.client,
                phone: `+  ${requestData.phone}`,
                license: requestData.license,
                rental_from: requestData.rental_from,
                rental_to: requestData.rental_to,
                status_id: 1,
                user_id: user.id
            });

            return response.status(200).json({
                message: "Operación exitosa",
                data: instance,
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

    async update({ request, response, params }) {
        try {
            const { client,
                phone,
                license,
                rental_from,
                rental_to,
                status_id } = request.all();

            const validation = await Vehicle.validateCreate(request.all());

            if (validation.fails()) {
                return response.status(422).send({
                    errors: validation.messages(),
                });
            }

            if (rental_from == rental_to) {
                throw Error("No se puede actualizr fechas iguales");
            }

            const vehicle = await Vehicle.findBy('id', params.id);
            vehicle.client = client;
            vehicle.phone = `+507 ${phone}`;
            vehicle.license = license;
            vehicle.rental_from = rental_from;
            vehicle.rental_to = rental_to;
            vehicle.status_id = status_id;
            await vehicle.save();

            return response.status(200).json({
                message: "Operación exitosa",
                data: vehicle,
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

    async update_status({ request, response }) {
        try {
            const requestData = request.all();

            const filterData = requestData.updateStatus.filter(val => {
                if (val.current_status != 2 && val.current_status != 4) {
                    return val
                }
            });

            let vehiclesUpdate = [];

            for (const iterator of filterData) {
                vehiclesUpdate.push(await Vehicle.query()
                    .where('id', iterator.vehicles_id)
                    .update({ status_id: iterator.status_id }));
            }

            return response.status(200).json({
                message: "Operación exitosa",
                data: vehiclesUpdate,
            });
        } catch (error) {
            return response
                .status(error.status === undefined ? 400 : error.status)
                .json({
                    error: {
                        message: "Error actualizando status",
                        details: "",
                        err_message: error.message,
                    },
                });
        }
    }

    async delete({ request, response }) {
        try {
            const deleteArray = request.all();

            const user = await Vehicle.query()
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
                        message: "Error al eliminar vehiculos",
                        details: "",
                        err_message: error.message,
                    },
                });
        }
    }

    async status_idex({ response }) {
        try {
            const status = await Status.query().whereNot('id', 1).fetch();
            return response.status(200).json({
                message: "Operación exitosa",
                data: status
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = VehicleController
