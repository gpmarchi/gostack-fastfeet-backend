import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const validationSchema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.string().required(),
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
