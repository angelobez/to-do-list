import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'task_coowners'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('users.id')
      table.integer('task_id').unsigned().references('tasks.id')
      table.unique(['user_id', 'task_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
