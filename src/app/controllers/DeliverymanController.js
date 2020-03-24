import * as Yup from 'yup';
import { Op } from 'sequelize';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { page = 1, limit = 6, query } = req.query;

    let where = {};
    if (query) {
      where = { where: { name: { [Op.iLike]: `%${query}%` } } };
    }

    const total = await Deliveryman.count(where);
    const totalPages = Math.ceil(total / limit);

    const deliverymen = await Deliveryman.findAll({
      ...where,
      order: ['name'],
      limit,
      offset: (page - 1) * limit,
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'filename', 'url'],
        },
      ],
    });

    return res.json({ deliverymen, totalPages });
  }

  async show(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found.' });
    }

    return res.json(deliveryman);
  }

  async store(req, res) {
    const validationSchema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number(),
    });

    if (!(await validationSchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Field validation failed.' });
    }

    const isDeliveryman = await Deliveryman.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (isDeliveryman) {
      return res.status(400).json({ error: 'Deliveryman already registered.' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }

  async update(req, res) {
    const { id } = req.params;

    let deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found.' });
    }

    const validationSchema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await validationSchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Field validation failed.' });
    }

    const existingDeliveryman = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (existingDeliveryman && existingDeliveryman.id !== Number(id)) {
      return res.status(400).json({ error: 'Deliveryman already registered.' });
    }

    deliveryman = await deliveryman.update(req.body);

    return res.json(deliveryman);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found.' });
    }

    await deliveryman.destroy();

    return res.send();
  }
}

export default new DeliverymanController();
