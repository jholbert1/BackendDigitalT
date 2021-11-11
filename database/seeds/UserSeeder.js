'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')
const Role = use('Adonis/Acl/Role')

class UserSeeder {
  async run() {
    const admin = new Role()
    admin.name = '1000'
    admin.slug = '1000'
    admin.description = 'Administrador'
    await admin.save()

    const user = new Role()
    user.name = '200'
    user.slug = '200'
    user.description = 'Usuario Sucursal'
    await user.save()

    const root = new User()
    root.email = 'root@mail.com'
    root.names = 'Digital'
    root.last_names = 'Tech'
    root.phone = '+507 123-4567'
    root.address = 'panama'
    root.birth_date = '2021-01-01'
    root.password = 'secret'
    root.is_active = true;
    root.code = '000000';
    await root.save()

    const userRootFind = await User.find(root.id)
    await userRootFind.roles().attach([admin.id])
  }
}

module.exports = UserSeeder
