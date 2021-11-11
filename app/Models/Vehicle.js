'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { validateAll } = use("Validator");
class Vehicle extends Model {

    static validateCreate(data) {
        const rules = {
            client: "required",
            phone: "required",
            license: "required",
            rental_from: "required",
            rental_to: "required"
        };
        return validateAll(data, rules);
    }

    status() {
        return this.belongsTo("App/Models/Status", "status_id");
    }

    user() {
        return this.belongsTo("App/Models/User", "user_id");
    }
}

module.exports = Vehicle
