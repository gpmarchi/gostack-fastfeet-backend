import faker from 'faker';
import { factory } from 'factory-girl';

import Deliveryman from '../src/app/models/Deliveryman';

factory.define('Deliveryman', Deliveryman, {
  name: faker.name.findName(),
  email: faker.internet.email(),
});

export default factory;
