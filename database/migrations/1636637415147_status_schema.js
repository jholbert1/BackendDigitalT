'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StatusSchema extends Schema {
  up () {
    this.create('statuses', (table) => {
      table.increments()
      table.string('name', 255).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('statuses')
  }
}

module.exports = StatusSchema
