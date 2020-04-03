import * as Yup from 'yup';
import { Op } from 'sequelize';

import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { page, limit, query } = req.query;

    const hasPagination = page && limit;

    let where = {};
    if (query) {
      where = { where: { name: { [Op.iLike]: `%${query}%` } } };
    }

    const total = hasPagination && (await Recipient.count(where));
    const totalPages = hasPagination && Math.ceil(total / limit);

    const recipients = await Recipient.findAll({
      ...where,
      order: ['name'],
      limit: hasPagination && limit,
      offset: hasPagination && (page - 1) * limit,
      attributes: [
        'id',
        'name',
        'street',
        'number',
        'complement',
        'state',
        'city',
        'zipcode',
      ],
    });
    return res.json(hasPagination ? { recipients, totalPages } : recipients);
  }

  async show(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Destinatário não encontrado.' });
    }

    return res.json(recipient);
  }

  async store(req, res) {
    const validationSchema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.string().required(),
    });

    if (!(await validationSchema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Verifique os campos do formulário.' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const { id } = req.params;

    let recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Destinatário não encontrado.' });
    }

    const validationSchema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zipcode: Yup.string(),
    });

    if (!(await validationSchema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Verifique os campos do formulário.' });
    }

    recipient = await recipient.update(req.body);

    return res.json(recipient);
  }

  async delete(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Destinatário não encontrado.' });
    }

    await recipient.destroy();

    return res.send();
  }
}

export default new RecipientController();
