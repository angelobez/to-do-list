import { DateTime } from 'luxon'
import {
  BaseModel,
  HasMany,
  ManyToMany,
  beforeSave,
  column,
  hasMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Task from './Task'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public remember_me_token?: string

  @hasMany(() => Task, {
    foreignKey: 'id_user',
  })
  public Tasks: HasMany<typeof Task>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
