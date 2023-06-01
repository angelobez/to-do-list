import Database from '@ioc:Adonis/Lucid/Database'
import Task from 'App/Models/Task'
import { BaseTask } from 'adonis5-scheduler/build'
import { DateTime } from 'luxon'

export default class VerifyTaskStatus extends BaseTask {
  public static get schedule() {
    return '0 * * * * *'
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return false
  }

  public async handle() {
    const tasks = await Task.query()

    for (let task of tasks) {
      const dateTime1 = task.updatedAt
      const dateTime2 = DateTime.now()

      const difference = dateTime2.diff(dateTime1, 'hours')

      if (task.status === 'PENDING' && difference.hours >= 1) {
        await Database.from('tasks').where('id', task.id).update({ status: 'ARCHIVED' })
      }
    }
    console.log('rodou')
  }
}
