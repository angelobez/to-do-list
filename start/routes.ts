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

// Route.get('/', 'TasksController.index').as('index')

// Route.get('/:id', 'TasksController.show').as('show')

// Route.post('/', 'TasksController.store').as('store')

// Route.put('/:id', 'TasksController.update').as('update')

// Route.delete('/:id', 'TasksController.destroy').as('destroy')

Route.resource('user', 'UsersController').apiOnly()
Route.shallowResource('user.task', 'TasksController').apiOnly()
