import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('new_status', ['ARCHIVED', 'PENDING', 'DONE'])
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('new_status')
    })
  }
}
