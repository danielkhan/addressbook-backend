const uniqid = require('uniqid');

class ContactService {
  constructor() {
    this.contacts = [];
  }

  add(contact) {
    contact.id = uniqid();
    this.contacts.push(contact);
    return contact;
  }

  list() {
    return this.contacts;
  }

  deleteAll() {
    this.contacts = [];
    return this.contacts;
  }
}

module.exports = ContactService;
