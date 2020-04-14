import { Router } from 'express';
import multer from 'multer';
import RateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

import multerConfig from './config/multer';
import redisConfig from './config/redis';

import authMiddleware from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import ParcelController from './app/controllers/ParcelController';
import DeliveryController from './app/controllers/DeliveryController';
import PickupController from './app/controllers/PickupController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import validateSessionStore from './app/validators/SessionStore';
import validateRecipientStore from './app/validators/RecipientStore';
import validateRecipientUpdate from './app/validators/RecipientUpdate';
import validatePickupStore from './app/validators/PickupStore';
import validateParcelStore from './app/validators/ParcelStore';
import validateParcelUpdate from './app/validators/ParcelUpdate';
import validateDeliveryProblemStore from './app/validators/DeliveryProblemStore';
import validateDeliverymanStore from './app/validators/DeliverymanStore';
import validateDeliverymanUpdate from './app/validators/DeliverymanUpdate';

const routes = new Router();

const upload = multer(multerConfig);

const redis = new Redis(redisConfig);
const loginLimiter = new RateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  store: new RedisStore({
    client: redis,
    resetExpiryOnChange: true,
    expiry: 60 * 5,
  }),
});

routes.post(
  '/sessions',
  loginLimiter,
  validateSessionStore,
  SessionController.store
);

routes.get('/deliveryman/:id/deliveries', DeliveryController.index);
routes.post(
  '/deliveryman/:id/deliveries/:parcelId',
  upload.single('file'),
  DeliveryController.store
);

routes.get('/deliverymen/:id', DeliverymanController.show);

routes.post(
  '/deliveryman/:id/pickups/:parcelId',
  validatePickupStore,
  PickupController.store
);

routes.get('/delivery/:parcelId/problems', DeliveryProblemController.show);
routes.post(
  '/delivery/:parcelId/problems',
  validateDeliveryProblemStore,
  DeliveryProblemController.store
);

routes.use(authMiddleware);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);
routes.post('/recipients', validateRecipientStore, RecipientController.store);
routes.patch(
  '/recipients/:id',
  validateRecipientUpdate,
  RecipientController.update
);
routes.delete('/recipients/:id', RecipientController.delete);

routes.get('/deliverymen', DeliverymanController.index);

routes.post(
  '/deliverymen',
  validateDeliverymanStore,
  DeliverymanController.store
);
routes.patch(
  '/deliverymen/:id',
  validateDeliverymanUpdate,
  DeliverymanController.update
);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

routes.get('/parcels', ParcelController.index);
routes.get('/parcels/:id', ParcelController.show);
routes.post('/parcels', validateParcelStore, ParcelController.store);
routes.patch('/parcels/:id', validateParcelUpdate, ParcelController.update);
routes.delete('/parcels/:id', ParcelController.delete);

routes.get('/delivery/problems', DeliveryProblemController.index);

routes.delete('/problems/:id/delivery', DeliveryProblemController.delete);

export default routes;
