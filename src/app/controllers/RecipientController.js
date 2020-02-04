import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const recipients = await Recipient.findAll();
    return res.json(recipients);
  }

  async show(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found.' });
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
      return res.status(400).json({ error: 'Field validation failed.' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const { id } = req.params;

    let recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found.' });
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
      return res.status(400).json({ error: 'Field validation failed.' });
    }

    recipient = await recipient.update(req.body);

    return res.json(recipient);
  }

  async delete(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found.' });
    }

    await recipient.destroy();

    return res.send();
  }
}

export default new RecipientController();
