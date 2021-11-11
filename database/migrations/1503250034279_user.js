'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up() {
    this.create('users', (table) => {
      table.increments()
      table.string('email', 150).notNullable().unique()
      table.string('names', 100).notNullable()
      table.string('last_names', 100).notNullable()
      table.string('phone', 14).notNullable()
      table.string('address', 250).notNullable()
      table.string('birth_date', 10).notNullable()
      table.string('password', 60).notNullable()
      table.boolean('is_active').notNullable()
      table.string('code').unique()
      table.timestamps()
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UserSchema
