import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @manyToMany(() => User, {
    pivotTable: 'task_coowners',
  })
  public coowner: ManyToMany<typeof User>

  @column()
  public id_user: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public due_date: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
