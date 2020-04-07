import request from 'supertest';
import app from '../../src/app';

describe('Deliveryman', () => {
  it('should be able to register a new deliveryman', async done => {
    const response = await request(app)
      .post('/deliverymen')
      .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
      .send({
        name: 'Deliveryman one',
        email: 'deliverymanone@gmail.com',
      });

    done();

    expect(response.body).toHaveProperty('id');
  });
});
