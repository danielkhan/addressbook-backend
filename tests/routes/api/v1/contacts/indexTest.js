// /tests/routes/api/v1/contacts/indexTest.js
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const { expect } = chai;
const config = require('../../../../../config').test;
const server = require('../../../../../app');

const app = server(config);

afterEach((done) => {
  chai.request(app)
    .del('/api/v1/contacts')
    .end((err) => {
      done(err);
    });
});

describe('POST /api/v1/contacts', () => {
  it('should return 400 for incomplete data', (done) => {
    chai.request(app)
      .post('/api/v1/contacts')
      .send({ firstname: 'James', lastname: 'Bond' })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res).to.be.json;
        expect(res.error).to.exist;
        done();
      });
  });

  it('should return 200 and the newwly created contact with valid data', (done) => {
    chai.request(app)
      .post('/api/v1/contacts')
      .send({
        firstname: 'Jim',
        lastname: 'Bond',
        street: 'Agent Street 7',
        zip: '007',
        city: 'London',
        email: 'daniel@khan.io',
      })
      .end((err, res) => {
        res.should.have.status(201);

        /* eslint-disable no-unused-expressions */
        expect(res).to.be.json;

        expect(res.body.data).to.exist;
        expect(res.body.data.id).to.exist;
        done();
      });
  });
});

describe('GET /api/v1/contacts', () => {
  it('should return a list of contacts', (done) => {
    chai.request(app)
      .post('/api/v1/contacts')
      .send({
        firstname: 'James',
        lastname: 'Bond',
        street: 'Agent Street 7',
        zip: '007',
        city: 'London',
        email: 'james@mi6.com',
      })
      .end(() => {
        chai.request(app)
          .post('/api/v1/contacts')
          .send({
            firstname: 'Steve',
            lastname: 'Jobs',
            street: 'Main Street 6',
            zip: '7876',
            city: 'San Jose',
            email: 'steve@apple.com',
          })
          .end(() => {
            chai.request(app)
              .get('/api/v1/contacts')
              .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                expect(res.body.data).to.exist;
                expect(res.body.data.length).to.equal(2);
                done();
              });
          });
      });
  });
});
