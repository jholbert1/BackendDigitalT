'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VehiclesSchema extends Schema {
  up() {
    this.create('vehicles', (table) => {
      table.increments()
      table.string('client', 255).notNullable()
      table.string('phone', 14).notNullable()
      table.string('license', 8).notNullable()
      table.string('rental_from', 10).notNullable()
      table.string('rental_to', 10).notNullable()
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("cascade");
      table
        .integer("status_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("statuses")
        .onDelete("cascade");
      table.timestamps()
    })
  }

  down() {
    this.drop('vehicles')
  }
}

module.exports = VehiclesSchema
