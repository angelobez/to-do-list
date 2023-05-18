import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const allUsers = await User.all()

    return response.ok(allUsers)
  }

  public async store({ request, response }: HttpContextContract) {
    const { name } = await request.all()

    const data = {
      name: name,
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
    await user.load('Tasks')

    return response.ok(user)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const { name } = await request.all()

    const data = { name: name }

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