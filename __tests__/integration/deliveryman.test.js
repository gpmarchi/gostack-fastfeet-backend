import request from 'supertest';
import jwt from 'jsonwebtoken';

import '../../src/bootstrap';
import authConfig from '../../src/config/auth';
import truncate from '../util/truncate';
import app from '../../src/app';

const token = jwt.sign({ id: 1 }, authConfig.secret, {
  expiresIn: authConfig.expiresIn,
});

describe('Deliveryman', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register a new deliveryman', async () => {
    const response = await request(app)
      .post('/deliverymen')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Deliveryman one',
        email: 'deliverymanone@gmail.com',
      });

    expect(response.body).toHaveProperty('id');
  });
});
