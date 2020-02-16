import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import ParcelController from './app/controllers/ParcelController';
import DeliveryController from './app/controllers/DeliveryController';
import PickupController from './app/controllers/PickupController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:id/deliveries', DeliveryController.index);
routes.post(
  '/deliveryman/:id/deliveries/:parcelId',
  upload.single('file'),
  DeliveryController.store
);

routes.post('/deliveryman/:id/pickups/:parcelId', PickupController.store);

routes.use(authMiddleware);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);
routes.post('/recipients', RecipientController.store);
routes.patch('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.get('/deliverymen', DeliverymanController.index);
routes.get('/deliverymen/:id', DeliverymanController.show);
routes.post('/deliverymen', DeliverymanController.store);
routes.patch('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

routes.get('/parcels', ParcelController.index);
routes.get('/parcels/:id', ParcelController.show);
routes.post('/parcels', ParcelController.store);
routes.patch('/parcels/:id', ParcelController.update);
routes.delete('/parcels/:id', ParcelController.delete);

export default routes;
