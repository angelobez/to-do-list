import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeSave, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Task from './Task'
import Hash from '@ioc:Adonis/Core/Hash'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import Route from '@ioc:Adonis/Core/Route'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public username: string

  @column()
  public email: string

  @column()
  public isActivated: boolean = false

  @column.dateTime()
  public email_verified_at: DateTime

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
  public async sendVerificationEmail() {
    const appDomain = Env.get('APP_URL')
    const appName = Env.get('APP_NAME')
    const currentYear = new Date().getFullYear()
    const url = Route.builder()
      .params({ email: this.email })
      .prefixUrl(appDomain)
      .makeSigned('verifyEmail', { expiresIn: '24hours' })
    Mail.send((message) => {
      message
        .from(Env.get('DEFAULT_FROM_EMAIL'))
        .to(this.email)
        .subject('Please verify your email')
        .htmlView('emails/auth/verify', { user: this, url, appName, appDomain, currentYear })
    })
  }
}
