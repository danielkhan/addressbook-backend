const UserModel = require('../models/UserModel');

class UserService {
  static async add(user) {
    const userModel = new UserModel(user);
    return userModel.save();
  }

  static async findById(id) {
    const foundUser = await UserModel.findById(id);
    return foundUser;
  }

  static async verifyUser(email, password) {
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser) return false;

    // ATTENTION - WITHOUT await alsways truthy!
    const validPassword = await foundUser.comparePassword(password);

    if (validPassword) {
      return foundUser;
    }
    return false;
  }
}

module.exports = UserService;
