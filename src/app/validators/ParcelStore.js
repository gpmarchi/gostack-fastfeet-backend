import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const validationSchema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    await validationSchema.validate(req.body, { abortEarly: false });

    return next();
  } catch (error) {
    return res.status(400).json({
      error: 'Verifique os campos do formulário.',
      messages: error.inner,
    });
  }
};
