require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });
    test('POST /api/toDo creates a new toDo', async() => {
      const newToDo = {
        to_do: 'dust',
        completed: false,
        user_id: 1
      };
      const data = await fakeRequest(app)
        .post('/api/toDo')
        .set('Authorization', token)
        .send(newToDo)
        .expect('Content-Type', /json/);

      expect(data.body.to_do).toEqual(newToDo.to_do);
      expect(data.body.id).toBeGreaterThan(0);
    });

    test('GET /api/toDo returns list of ToDos', async() => {
      const expectation = 
        {
          id: 4,
          to_do: 'dust',
          completed: false,
          user_id: 2
        };

      const data = await fakeRequest(app)
        .get('/api/toDo')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body[0]).toEqual(expectation);
    });


    test('PUT /api/toDo creates an updated toDo', async () => {
      const updatedToDo = {
        id: 4,
        to_do: 'dust',
        completed: false,
        user_id: 1
      };

      const data = await fakeRequest(app)
        .put('/api/toDo/4')
        .set('Authorization', token)
        .send(updatedToDo)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.to_do).toEqual(updatedToDo.to_do);
      expect(data.body.id).toEqual(updatedToDo.id);
    });
  });
});

