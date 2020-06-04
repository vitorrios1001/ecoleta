import { Request, Response } from 'express'
import knex from '../database/connection'

class PointsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()))

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')

    return res.json(points)
  }

  async show(req: Request, res: Response) {
    const { id } = req.params

    const point = await knex('points').where('id', id).first()

    if (!point) {
      return res.status(400).json({ message: 'Point not found'})
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title')

    return res.json({ point, items })
  }

  async create(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      longitude,
      latitude,
      city,
      uf,
      items,
    } = req.body
  
    const trx = await knex.transaction()
  
    const point = {
      image: 'https://images.unsplash.com/photo-1573481078935-b9605167e06b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      email,
      name,
      whatsapp,
      longitude,
      latitude,
      city,
      uf,
    }

    let insertedIds: number[] = []
      
    try {
      insertedIds = await trx('points').insert(point)
    } catch (error) {
      await trx.rollback()
      return res.status(412).json({ message: 'Ocorreu um erro ao tentar gravar os dados'})
    }
  
    const point_id = insertedIds[0]
  
    const pointItems = items.map((item_id: number) => ({
      item_id,
      point_id,
    }))
  
    try {
      await trx('point_items').insert(pointItems)
    } catch (error) {
      await trx.rollback()
      return res.status(412).json({ message: 'Ocorreu um erro ao tentar gravar os dados'})
    }
    
    await trx.commit()

    return res.json({
      ...point,
      id: point_id,
    })
  }
}

export default PointsController;
