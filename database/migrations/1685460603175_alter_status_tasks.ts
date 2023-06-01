import Database from '@ioc:Adonis/Lucid/Database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  public async up() {
    await Database.rawQuery(
      `UPDATE ${this.tableName} SET new_status = CASE
      WHEN status = true THEN 'DONE'
     WHEN status = false THEN 'PENDING'
     END`
    )
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')

      table.renameColumn('new_status', 'status')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Adicionar coluna 'new_status' como boolean (ou o tipo original da coluna 'status')
      table.boolean('new_status')
    })

    // Agora, vamos atualizar a nova coluna baseada na antiga
    await Database.rawQuery(`
      UPDATE ${this.tableName} SET new_status = CASE
      WHEN status = 'DONE' THEN true
      WHEN status = 'PENDING' THEN false
      END`)

    // Agora, vamos remover a antiga coluna 'status'
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
    })

    // E por fim, vamos renomear a coluna 'new_status' para 'status'
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('new_status', 'status')
    })
  }
}
