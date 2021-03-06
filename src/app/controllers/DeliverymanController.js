import { Op } from 'sequelize';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

import Cache from '../../lib/Cache';

class DeliverymanController {
  async index(req, res) {
    const { page, limit, query } = req.query;

    const hasPagination = page && limit;

    const cached = await Cache.get(
      hasPagination ? `deliverymen:page:${page}` : 'deliverymen'
    );

    if (cached && !query) {
      return res.json(cached);
    }

    let where = {};
    if (query) {
      where = { where: { name: { [Op.like]: `%${query}%` } } };
    }

    const total = hasPagination && (await Deliveryman.count(where));
    const totalPages = hasPagination && Math.ceil(total / limit);

    const deliverymen = await Deliveryman.findAll({
      ...where,
      order: ['name'],
      limit: hasPagination && limit,
      offset: hasPagination && (page - 1) * limit,
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'filename', 'url'],
        },
      ],
    });

    if (!query) {
      Cache.set(
        hasPagination ? `deliverymen:page:${page}` : 'deliverymen',
        hasPagination ? { deliverymen, totalPages } : deliverymen
      );
    }

    return res.json(hasPagination ? { deliverymen, totalPages } : deliverymen);
  }

  async show(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id, {
      attributes: ['id', 'name', 'email', 'createdAt'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'filename', 'url'],
        },
      ],
    });

    if (!deliveryman) {
      return res.status(404).json({
        error: 'Entregador não encontrado.',
      });
    }

    return res.json(deliveryman);
  }

  async store(req, res) {
    const isDeliveryman = await Deliveryman.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (isDeliveryman) {
      return res.status(400).json({ error: 'Entregador já cadastrado.' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    Cache.invalidateKeys('deliverymen:page:*');
    Cache.invalidate('deliverymen');

    return res.json(deliveryman);
  }

  async update(req, res) {
    const { id } = req.params;

    let deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não encontrado.' });
    }

    const { email: updatedEmail } = req.body;

    if (updatedEmail) {
      const existingDeliveryman = await Deliveryman.findOne({
        where: { email: updatedEmail },
      });

      if (existingDeliveryman && existingDeliveryman.id !== Number(id)) {
        return res.status(400).json({ error: 'Entregador já cadastrado.' });
      }
    }

    deliveryman = await deliveryman.update(req.body);

    return res.json(deliveryman);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Entregador não encontrado.' });
    }

    await deliveryman.destroy();

    Cache.invalidateKeys('deliverymen:page:*');
    Cache.invalidate('deliverymen');

    return res.send();
  }
}

export default new DeliverymanController();
