const express = require('express');

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Contact:
 *     type: object,
 *     required:
 *       - firstname
 *       - lastname
 *       - email
 *     properties:
 *       firstname:
 *         type: string
 *       lastname:
 *         type: string
 *       email:
 *         type: string
 *       street:
 *         type: string
 *       zip:
 *         type: string
 *       city:
 *         type: string
 */

module.exports = (params) => {
  const { contactService } = params;

  /**
   * @swagger
   * /contacts:
   *   post:
   *     parameters:
   *       - in: body
   *         name: contact
   *         schema:
   *           $ref: "#/definitions/Contact"
   *     description: Creates a new contact
   *     responses:
   *       201:
   *         description: Contact created
   *       400:
   *         description: Missing Data
   *       500:
   *         description: General Error
   */
  router.post('/', (req, res) => {
    try {
      if (!req.body.firstname) {
        return res.status(400).json({ error: 'Missing first name!' });
      }

      if (!req.body.lastname) {
        return res.status(400).json({ error: 'Missing last name!' });
      }

      if (!req.body.email) {
        return res.status(400).json({ error: 'Missing email!' });
      }

      const newContact = contactService.add(req.body);
      return res.status(201).json({ data: newContact });
    } catch (error) {
      return res.status(500).json({ error });
    }
  });

  /**
   * @swagger
   * /contacts:
   *   get:
   *     description: Return all contacts
   *     responses:
   *       200:
   *         description: Contact created
   */
  router.get('/', (req, res) => {
    const contacts = contactService.list();
    return res.status(200).json({ data: contacts });
  });

  /**
  * @swagger
  * /contacts:
  *   delete:
  *     description: Deletes all contacts
  *     responses:
  *       202:
  *         description: Contacts deleted
  */
  router.delete('/', (req, res) => {
    const contacts = contactService.deleteAll();
    return res.status(202).json({ data: contacts });
  });

  return router;
};
