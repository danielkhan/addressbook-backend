/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiHttp = require('chai-http');

const ContactModel = require('../../../../../models/ContactModel');
const UserModel = require('../../../../../models/UserModel');

chai.use(chaiHttp);
chai.should();

const { expect } = chai;
const config = require('../../../../../config').test;
const server = require('../../../../../app');

const app = server(config);

afterEach(async () => {
  await ContactModel.remove();
  await UserModel.remove();
});

const completeContact = {
  firstname: 'Jim',
  lastname: 'Bond',
  street: 'Agent Street 7',
  zip: '007',
  city: 'London',
  email: 'jim@bondio.io',
};

const user = {
  email: 'test@test.com',
  password: '12345678',
};

async function authenticate() {
  return chai.request(app)
    .post('/api/v1/users/register')
    .send(user)
    .then(() =>
      chai.request(app)
        .post('/api/v1/users/login')
        .send(user)
        .then(res => res.body.data.token))
    .catch((err) => {
      throw err;
    });
}

describe('POST /api/v1/contacts', () => {
  it('should return 401 for unauthorized requests', () =>
    chai.request(app)
      .post('/api/v1/contacts')
      .send(completeContact)
      .then((res) => {
        res.should.have.status(401);
      }));

  it('should return 400 for incomplete data', async () => {
    const token = await authenticate();
    return chai.request(app)
      .post('/api/v1/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstname: 'James', lastname: 'Bond' })
      .then((res) => {
        res.should.have.status(400);
        expect(res).to.be.json;
        expect(res.error).to.exist;
      });
  });
  it('should return 200 and the newly created contact with valid data', async () => {
    const token = await authenticate();
    return chai.request(app)
      .post('/api/v1/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send(completeContact)
      .then((res) => {
        res.should.have.status(201);
        /* eslint-disable no-unused-expressions */
        expect(res).to.be.json;
        expect(res.body.data).to.exist;
        expect(res.body.data._id).to.exist;
      });
  });
});

describe('PUT /api/v1/contacts/:contactId', () => {
  it('should return 202 and the updated contact after update', async () => {
    const token = await authenticate();
    return chai.request(app)
      .post('/api/v1/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send(completeContact)
      .then((res) => {
        res.should.have.status(201);
        /* eslint-disable no-unused-expressions */
        expect(res).to.be.json;
        expect(res.body.data).to.exist;
        const contact = res.body.data;
        expect(contact.email).to.equal('jim@bondio.io');
        expect(contact._id).to.exist;

        contact.email = 'test@test.io';
        return chai.request(app)
          .put(`/api/v1/contacts/${contact._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(contact)
          .then((uRes) => {
            uRes.should.have.status(202);
            expect(uRes).to.be.json;
            expect(uRes.body.data).to.exist;
            expect(uRes.body.data.email).to.equal('test@test.io');
          });
      });
  });
});

describe('GET /api/v1/contacts', () => {
  it('should return a list of contacts', async () => {
    const token = await authenticate();
    return chai.request(app)
      .post('/api/v1/contacts')
      .send(completeContact)
      .set('Authorization', `Bearer ${token}`)
      .then((res1) => {
        res1.should.have.status(201);
        return chai.request(app)
          .post('/api/v1/contacts')
          .send(completeContact)
          .set('Authorization', `Bearer ${token}`)
          .then((res2) => {
            res2.should.have.status(201);
            return chai.request(app)
              .get('/api/v1/contacts')
              .set('Authorization', `Bearer ${token}`)
              .then((res) => {
                res.should.have.status(200);
                expect(res).to.be.json;
                expect(res.body.data).to.exist;
                expect(res.body.data.length).to.equal(2);
              });
          });
      });
  });
});

describe('DELETE /api/v1/contacts/:contactId', () => {
  it('should delete a contact', async () => {
    const token = await authenticate();
    return chai.request(app)
      .post('/api/v1/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send(completeContact)
      .then(res => res.body.data)
      .then((contact) => {
        expect(contact._id).to.exist;
        return chai.request(app)
          .delete(`/api/v1/contacts/${contact._id}`)
          .set('Authorization', `Bearer ${token}`)
          .then((res) => {
            res.should.have.status(202);
            expect(res.body.data).to.equal('ok');
            return chai.request(app)
              .get('/api/v1/contacts')
              .set('Authorization', `Bearer ${token}`)
              .then((gRes) => {
                gRes.should.have.status(200);
                expect(gRes.body.data.length).to.equal(0);
              });
          });
      });
  });
});

describe('GET /api/v1/contacts/:contactId', () => {
  it('should fetch a contact', async () => {
    const token = await authenticate();
    return chai.request(app)
      .post('/api/v1/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send(completeContact)
      .then(res => res.body.data)
      .then((contact) => {
        expect(contact._id).to.exist;
        return chai.request(app)
          .get(`/api/v1/contacts/${contact._id}`)
          .set('Authorization', `Bearer ${token}`)
          .then((res) => {
            res.should.have.status(200);
            expect(res.body.data).to.exist;
            expect(res.body.data.email).to.equal('jim@bondio.io');
          });
      });
  });
});
