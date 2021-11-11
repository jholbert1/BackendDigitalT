'use strict'

/*
|--------------------------------------------------------------------------
| StatusSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Status = use('App/Models/Status')

class StatusSeeder {
  async run () {
    const reserved = new Status();
    reserved.name = 'reservado';
    await reserved.save();

    const cancel = new Status();
    cancel.name = 'cancelado';
    await cancel.save();

    const retired = new Status();
    retired.name = 'retirado cliente';
    await retired.save();

    const delivered = new Status();
    delivered.name = 'entregado';
    await delivered.save();
  }
}

module.exports = StatusSeeder
