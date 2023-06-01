import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const users = await Database.from('users').paginate(page, limit)

    return response.ok(users)
  }

  public async store({ request, response }: HttpContextContract) {
    const { name, username, email, password } = await request.all()

    const data = {
      name: name,
      username: username,
      email: email,
      password: password,
    }

    const user = await User.findBy('email', email)

    if (user) {
      return response.badRequest({ mensagem: 'Email já cadastrado' })
    }

    if (!name) {
      return response.badRequest({ mensagem: 'O campo name é necessário' })
    }

    await User.create(data)

    return response.ok({ mensagem: 'Usuário criado com sucesso' })
  }

  public async show({ params, response }: HttpContextContract) {
    let id = params.id

    const user = await User.findBy('id', id)

    if (!user) {
      return response.badRequest({ mensagem: 'Usuário não encontrado' })
    }
    await user.load('Tasks', (q) => {
      q.preload('coowner')
    })

    return response.ok(user)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const { name, username, email, password } = await request.all()

    const data = { name: name, username: username, email: email, password: password }

    let id = params.id

    const user = await User.findBy('id', id)

    if (!user) {
      return response.badRequest({ mensagem: 'Usuário não encontrado' })
    }
    user.merge(data)

    await user.save()

    return response.ok({ mensagem: 'Usuário atualizado com sucesso' })
  }

  public async destroy({ params, response }: HttpContextContract) {
    let id = params.id

    const user = await User.findBy('id', id)

    if (!user) {
      return response.badRequest({ mensagem: 'Usuário não encontrado' })
    }

    await user.delete()

    return response.ok({ mensagem: 'Usuário apagado com sucesso' })
  }
}
