/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Database from '@ioc:Adonis/Lucid/Database'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'

Route.resource('task', 'TasksController').apiOnly()

// check db connection
Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.group(() => {
  Route.post('register', 'Users/AuthController.register').as('register')
  Route.post('login', 'Users/AuthController.login').as('login')
  Route.post('logout', 'Users/AuthController.logout').as('logout')
  Route.get('dashboard', 'Users/AuthController.dashboard')
  Route.get('task', async ({ auth, request }) => {
    await auth.use('api').authenticate()

    const user_id = auth.user!.id

    const page = request.input('page', 1)

    const tasks = await Database.from('tasks').where('id_user', user_id).paginate(page, 5)

    return tasks
  })
  Route.put('task/:id', async ({ params, request, response }: HttpContextContract) => {
    const { status } = await request.all()

    let id = params.id

    console.log(id)

    const task = await Task.findBy('id', id)
    const user = await User.findBy('id', task?.id_user)

    if (!task) {
      return response.badRequest({ mensagem: 'Tarefa não encontrado' })
    }

    const data = {
      status: status,
    }

    task.merge(data)

    await task.save()

    if (status === 'DONE') {
      Mail.send((message) => {
        message
          .from(Env.get('DEFAULT_FROM_EMAIL'))
          .to(user!.email)
          .subject(`A tarefa ${task.name} foi concluída!`)
        console.log('email enviado')
      })
    }

    return response.ok({ mensagem: 'Tarefa atualizada com sucesso' })
  })
}).prefix('user/')
Route.resource('user', 'UsersController').apiOnly()

Route.get('/verify-email/:email', 'users/EmailVerificationsController.confirm').as('verifyEmail')
