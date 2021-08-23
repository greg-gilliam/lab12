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

    test('GET/ToDoList returns list of ToDo', async() => {
      const expectation =
        {
          id: 1,
          to_do: 'walk the dog',
          completed: false,
          user_id: 1
        };

      const data = await fakeRequest(app)
        .get('/toDo')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body[0]).toEqual(expectation);
    });
    
    test('POST /toDo creates a new toDo', async() => {
      const newToDo = {
        to_do: 'dust',
        completed: false,
        user_id: 1
      };
      const data = await fakeRequest(app)
        .post('/toDo')
        .send(newToDo)
        .expect('Content-Type', /json/);

      expect(data.body.to_do).toEqual(newToDo.to_do);
      expect(data.body.id).toBeGreaterThan(0);
    });
  });
});

