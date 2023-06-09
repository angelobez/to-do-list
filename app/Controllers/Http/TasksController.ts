import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Task from 'App/Models/Task'
import User from 'App/Models/User'

export default class TasksController {
  public async index({ request, response, auth }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const tasks = await Database.from('tasks').paginate(page, limit)

    return response.ok(tasks)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const { name, description, due_date, coowner } = request.all()
    await auth.use('api').authenticate()
    console.log(auth.use('api').user!)
    const user = await User.findBy('id', auth.user?.id)

    if (!user) {
      return response.badRequest({ mensagem: 'Usuário não encontrado' })
    }

    if (!name || !description || !due_date || !coowner) {
      return response.badRequest({
        mensagem: 'Os campos name, description, due_date e o array de coowner são necessários',
      })
    }

    const data = {
      name: name,
      id_user: auth.user?.id,
      description: description,
      due_date: due_date,
      status: 'PENDING',
    }

    const task = await Task.create(data)
    await task.related('coowner').attach(coowner)

    return response.ok({ mensagem: 'Tarefa criada com sucesso' })
  }

  public async show({ params, response }: HttpContextContract) {
    let id = params.id

    const task = await Task.findBy('id', id)

    if (!task) {
      return response.badRequest({ mensagem: 'Tarefa não encontrado' })
    }

    return response.ok(task)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const { name, id_user, description, due_date, status } = await request.all()

    let id = params.id

    const task = await Task.findBy('id', id)

    if (!task) {
      return response.badRequest({ mensagem: 'Tarefa não encontrado' })
    }

    const user = await User.findBy('id', id_user)

    if (!user) {
      response.badRequest({ mensagem: 'Usuário não encontrado' })
    }

    const data = {
      name: name,
      id_user: id_user,
      description: description,
      due_date: due_date,
      status: status,
    }

    task.merge(data)

    await task.save()

    return response.ok({ mensagem: 'Tarefa atualizada com sucesso' })
  }

  public async destroy({ response, params }: HttpContextContract) {
    let id = params.id

    const task = await Task.findBy('id', id)

    if (!task) {
      return response.badRequest({ mensagem: 'Tarefa não encontrado' })
    }

    await task.delete()

    return response.ok({ mensagem: 'Tarefa apagada com sucesso' })
  }
}
