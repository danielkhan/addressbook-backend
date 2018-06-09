const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const UserService = require('../../../../services/UserService');

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object,
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */
module.exports = (params) => {
  const logger = params.config.logger();
  const { config } = params;


  /**
  * @swagger
  * /users/register:
  *   post:
  *     parameters:
  *       - in: body
  *         name: user
  *         description: The user to create.
  *         schema:
  *           $ref: "#/definitions/User"
  *     description: Creates a new user
  *     responses:
  *       201:
  *         description: User created
  *       400:
  *         description: Error - missing data
  *       500:
  *         description: Error - general problem
  */
  router.post('/register', async (req, res) => {
    try {
      if (!req.body.email) {
        return res.status(400).json({ error: 'Missing email! ' });
      }

      if (!req.body.password || req.body.password.trim().length < 6) {
        return res.status(400).json({ error: 'Missing or invalid password! ' });
      }
      const newUser = await UserService.add(req.body);
      return res.status(201).json({ data: newUser });
    } catch (err) {
      logger.fatal(err);
      return res.status(500).json({ error: err });
    }
  });

  /**
  * @swagger
  * /users/login:
  *   post:
  *     parameters:
  *       - in: body
  *         name: user
  *         description: User login
  *         schema:
  *           $ref: "#/definitions/User"
  *     description: Logs in a user
  *     responses:
  *       200:
  *         description: Logged in
  *       400:
  *         description: Error - missing data
  *       500:
  *         description: Error - general problem
  */
  router.post('/login', async (req, res) => {
    try {
      return passport.authenticate('local', { session: false }, (err, user) => {
        if (err || !user) {
          return res.status(404).json({ error: 'Invalid username or password' });
        }
        return req.login(user, { session: false }, (loginErr) => {
          if (loginErr) {
            res.status(500).json({ error: loginErr });
          }

          const token = jwt.sign({ userId: user._id }, config.JWT_SECRET);
          return res.json({ data: { user, token } });
        });
      })(req, res);
    } catch (err) {
      logger.fatal(err);
      return res.status(500).json({ error: err });
    }
  });

  return router;
};
