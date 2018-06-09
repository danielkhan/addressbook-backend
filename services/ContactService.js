const ContactModel = require('../models/ContactModel');

class ContactService {
  static async add(contact, userId) {
    contact.user_id = userId;
    const contactModel = new ContactModel(contact);
    return contactModel.save();
  }

  static async update(contact, contactId, userId) {
    return ContactModel.findOneAndUpdate({
      _id: contactId,
      user_id: userId,
    }, contact, { new: true });
  }

  static async list(userId) {
    return ContactModel.find({ user_id: userId }).sort({ lastname: 1 });
  }

  static async delete(contactId, userId) {
    return ContactModel.remove({ _id: contactId, user_id: userId });
  }

  static async findById(contactId, userId) {
    return ContactModel.findOne({ _id: contactId, user_id: userId });
  }

  static async deleteAll(userId) {
    return ContactModel.remove({ user_id: userId });
  }
}

module.exports = ContactService;
