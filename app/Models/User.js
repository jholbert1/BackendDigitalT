'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')


/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const { validateAll } = use("Validator");

class User extends Model {
  static get hidden() {
    return ['password', 'code', 'is_active']
  }

  static get traits() {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission'
    ]
  }

  static validateCreate(data) {
    const rules = {
      email: "required|email|unique:users,email",
      names: "required",
      last_names: "required",
      phone: "required",
      address: "required",
      birth_date: "required"
    };
    return validateAll(data, rules);
  }

  static validateUpdate(data, userId) {
    const rules = {
      email:  `required|email|unique:users,email,id,${userId}`,
      names: "required",
      last_names: "required",
      phone: "required",
      address: "required",
      birth_date: "required"
    };
    return validateAll(data, rules);
  }

  static validateLogin(data) {
    const rules = {
      email: "required|email",
      password: "required",
    };
    return validateAll(data, rules);
  }

  static makeCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  roles() {
    return this.hasOne('App/Models/Role')
  }
}

module.exports = User
