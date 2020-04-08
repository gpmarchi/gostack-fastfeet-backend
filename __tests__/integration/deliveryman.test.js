import request from 'supertest';
import jwt from 'jsonwebtoken';

import '../../src/bootstrap';
import factory from '../factories';
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
    const deliveryman = await factory.attrs('Deliveryman');

    const response = await request(app)
      .post('/deliverymen')
      .set('Authorization', `Bearer ${token}`)
      .send(deliveryman);

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register a new deliveryman with invalid data', async () => {
    const deliveryman = await factory.attrs('Deliveryman');
    delete deliveryman.email;

    const response = await request(app)
      .post('/deliverymen')
      .set('Authorization', `Bearer ${token}`)
      .send(deliveryman);

    expect(response.status).toBe(400);
  });

  it('should not be able to register a deliveryman with duplicated email', async () => {
    const deliveryman = await factory.attrs('Deliveryman');

    await factory.create('Deliveryman');

    const response = await request(app)
      .post('/deliverymen')
      .set('Authorization', `Bearer ${token}`)
      .send(deliveryman);

    expect(response.status).toBe(400);
  });

  it('should list all registered deliverymen', async () => {
    const deliverymen = await factory.attrs('Deliverymen');

    const keys = Object.keys(deliverymen);
    for (const key of keys) {
      await factory.create('Deliveryman', deliverymen[key]);
    }

    const response = await request(app)
      .get('/deliverymen')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body).toHaveLength(5);
  });

  it('should list all registered deliverymen filtered by the letter a', async () => {
    const deliverymen = await factory.attrs('Deliverymen');

    const keys = Object.keys(deliverymen);
    for (const key of keys) {
      await factory.create('Deliveryman', deliverymen[key]);
    }

    const response = await request(app)
      .get('/deliverymen?query=a')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should list all registered deliverymen paginated', async () => {
    const deliverymen = await factory.attrs('Deliverymen');

    const keys = Object.keys(deliverymen);
    for (const key of keys) {
      await factory.create('Deliveryman', deliverymen[key]);
    }

    const response = await request(app)
      .get('/deliverymen?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body).toHaveProperty('totalPages', 3);
  });

  it('should show registered deliveryman by id', async () => {
    const deliveryman = await factory.create('Deliveryman');

    const response = await request(app)
      .get(`/deliverymen/${deliveryman.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body).toHaveProperty('name', deliveryman.name);
  });

  it('should not show unregistered deliveryman id', async () => {
    const deliveryman = await factory.create('Deliveryman');

    const response = await request(app)
      .get(`/deliverymen/${deliveryman.id + 1}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(404);
  });

  it('should be able to update an existing deliveryman', async () => {
    const deliveryman = await factory.create('Deliveryman');

    const response = await request(app)
      .patch(`/deliverymen/${deliveryman.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated name',
      });

    expect(response.body).toHaveProperty('name', 'Updated name');
  });

  it('should not be able to update an inexisting deliveryman', async () => {
    const deliveryman = await factory.attrs('Deliveryman');

    const response = await request(app)
      .patch('/deliverymen/9999')
      .set('Authorization', `Bearer ${token}`)
      .send(deliveryman);

    expect(response.status).toBe(400);
  });

  it('should not be able to update an existing deliveryman with invalid fields', async () => {
    const deliveryman = await factory.create('Deliveryman');

    const response = await request(app)
      .patch(`/deliverymen/${deliveryman.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'some email',
      });

    expect(response.status).toBe(400);
  });

  it('should able to update an existing deliveryman with new email', async () => {
    const deliveryman = await factory.create('Deliveryman');

    const response = await request(app)
      .patch(`/deliverymen/${deliveryman.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'somenewemail@email.com',
      });

    expect(response.status).toBe(200);
  });

  it('should not be able to update an existing deliveryman with another user email', async () => {
    const deliverymen = await factory.attrs('Deliverymen');
    let deliverymanOne = deliverymen[0];
    let deliverymanTwo = deliverymen[1];

    deliverymanOne = await factory.create('Deliveryman', deliverymanOne);
    deliverymanTwo = await factory.create('Deliveryman', deliverymanTwo);

    const response = await request(app)
      .patch(`/deliverymen/${deliverymanTwo.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: deliverymanOne.email,
      });

    expect(response.status).toBe(400);
  });

  it('should able to delete an existing deliveryman', async () => {
    const deliveryman = await factory.create('Deliveryman');

    const deleteResponse = await request(app)
      .delete(`/deliverymen/${deliveryman.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    const getResponse = await request(app)
      .get(`/deliverymen/${deliveryman.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(deleteResponse.status).toBe(200);
    expect(getResponse.status).toBe(404);
    expect(getResponse.body).toHaveProperty('error');
  });

  it('should not be able to delete an inexisting deliveryman', async () => {
    const response = await request(app)
      .delete(`/deliverymen/9999`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(404);
  });
});
