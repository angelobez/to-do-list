import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import User from 'App/Models/User'

export default class TasksController {
  public async index({ response }: HttpContextContract) {
    const allTasks = await Task.all()

    return response.ok(allTasks)
  }

  public async store({ request, response }: HttpContextContract) {
    const { name, id_user, description, due_date, status } = await request.all()

    const user = await User.findBy('id', id_user)

    if (!user) {
      return response.badRequest({ mensagem: 'Usuário não encontrado' })
    }

    if (!name || !description || !due_date || status == null) {
      return response.badRequest({
        mensagem: 'Os campos name, description, due_date e status são necessários',
      })
    }

    const data = {
      name: name,
      id_user: id_user,
      description: description,
      due_date: due_date,
      status: status,
    }

    await Task.create(data)

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
