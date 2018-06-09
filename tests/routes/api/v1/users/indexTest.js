/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiHttp = require('chai-http');

const UserModel = require('../../../../../models/UserModel');

chai.use(chaiHttp);
chai.should();

const { expect } = chai;
const config = require('../../../../../config').test;
const server = require('../../../../../app');

const app = server(config);

afterEach((done) => {
  UserModel.remove().then(() => done());
});

const user = {
  email: 'testxy@test.com',
  password: '12345678',
};

describe('POST /api/v1/users/register', () => {
  it('should return 400 for incomplete data', (done) => {
    chai.request(app)
      .post('/api/v1/users/register')
      .send({ email: 'foo@bar.com', password: '1234' })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res).to.be.json;
        expect(res.error).to.exist;
        done();
      });
  });

  it('should return 201 and the newly created user with valid data', () =>
    chai.request(app)
      .post('/api/v1/users/register')
      .send(user)
      .then((res) => {
        res.should.have.status(201);
        /* eslint-disable no-unused-expressions */
        expect(res).to.be.json;
        expect(res.body.data).to.exist;
        expect(res.body.data._id).to.exist;
      }));
});

describe('POST /api/v1/users/login', () => {
  it('should return 404 for an invalid password', (done) => {
    chai.request(app)
      .post('/api/v1/users/register')
      .send(user)
      .end(() => {
        chai.request(app)
          .post('/api/v1/users/login')
          .send({
            email: 'foo@bar.com',
            password: 'wrongpassword',
          })
          .end((err, res) => {
            if (err) return done(err);
            res.should.have.status(404);
            return done();
          });
      });
  });

  it('should return 200 and a token for a valid password', (done) => {
    chai.request(app)
      .post('/api/v1/users/register')
      .send(user)
      .end(() => {
        chai.request(app)
          .post('/api/v1/users/login')
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.data).to.exist;
            expect(res.body.data.token).to.exist;
            expect(res.body.data.user).to.exist;
            expect(res.body.data.user.password).to.not.exist;
            return done();
          });
      });
  });
});
