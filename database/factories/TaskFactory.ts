import Task from 'App/Models/Task'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const TaskFactory = Factory.define(Task, ({ faker }) => {
  return {
    name: faker.lorem.sentence(3),
    description: faker.lorem.sentence(5),
    due_date: faker.date.future().toDateString(),
    status: false,
  }
}).build()
