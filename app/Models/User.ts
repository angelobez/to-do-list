import { DateTime } from 'luxon'
import { BaseModel, HasMany, ManyToMany, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Task from './Task'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @manyToMany(() => Task, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'task_id',
    pivotTable: 'task_users',
  })
  public tasks: ManyToMany<typeof Task>

  @column()
  public name: string

  @hasMany(() => Task, {
    foreignKey: 'id_user',
  })
  public Tasks: HasMany<typeof Task>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
