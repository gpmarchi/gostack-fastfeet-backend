import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const validationSchema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zipcode: Yup.string(),
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
