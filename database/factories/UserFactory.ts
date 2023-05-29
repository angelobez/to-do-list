import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { TaskFactory } from './TaskFactory'

export default Factory.define(User, ({ faker }) => {
  const q = faker.internet.userName()
  return {
    name: q,
    username: q,
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
})
  .relation('Tasks', () => TaskFactory) // 👈
  .build()
