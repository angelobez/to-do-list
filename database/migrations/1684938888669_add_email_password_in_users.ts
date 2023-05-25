import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('username', 50).notNullable().unique()
      table.string('email', 255).notNullable().unique
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('email')
      table.dropColumn('password')
      table.dropColumn('remember_me_token')
    })
  }
}
