/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const express = require('express');
const ContactService = require('../../../../services/ContactService');

const router = express.Router();

/**
* @swagger
* definitions:
*   Contact:
*     type: object
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

module.exports = () => {
  /**
  * @swagger
  * /contacts:
  *   post:
  *     parameters:
  *       - in: body
  *         name: contact
  *         description: The contact to create.
  *         schema:
  *           $ref: "#/definitions/Contact"
  *     description: Creates a new contact
  *     security:
  *       - BearerAuth: []
  *     responses:
  *       201:
  *         description: Contact created
  *       400:
  *         description: Error - missing data
  *       500:
  *         description: Error - general problem
  */
  router.post('/', async (req, res) => {
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
      const newContact = await ContactService.add(req.body, req.user._id);
      return res.status(201).json({ data: newContact });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });

  /**
  * @swagger
  * /contacts:
  *   get:
  *     description: Return all contacts
  *     security:
  *       - BearerAuth: []
  *     responses:
  *       200:
  *         description: Contact created
  */
  router.get('/', async (req, res) => {
    const contacts = await ContactService.list(req.user._id);
    return res.json({ data: contacts });
  });

  /**
  * @swagger
  * /contacts:
  *   delete:
  *     description: Return all contacts
  *     security:
  *       - BearerAuth: []
  *     responses:
  *       202:
  *         description: Contact deleted
  */
  router.delete('/', async (req, res) => {
    await ContactService.deleteAll(req.user._id);
    return res.json({ data: 'ok' });
  });

  /**
  * @swagger
  * /contacts/{contactId}:
  *   delete:
  *     parameters:
  *       - in: path
  *         name: contactId
  *     description: Delete a contact
  *     security:
  *       - BearerAuth: []
  *     responses:
  *       202:
  *         description: Contact successfully deleted
  */
  router.delete('/:contactId', async (req, res) => {
    await ContactService.delete(req.params.contactId, req.user._id);
    return res.status(202).json({ data: 'ok' });
  });

  /**
  * @swagger
  * /contacts/{contactId}:
  *   get:
  *     parameters:
  *       - in: path
  *         name: contactId
  *     description: Return a contact
  *     security:
  *       - BearerAuth: []
  *     responses:
  *       200:
  *         description: Successful
  */
  router.get('/:contactId', async (req, res) => {
    const contact = await ContactService.findById(req.params.contactId, req.user._id);
    return res.status(200).json({ data: contact });
  });

  /**
  * @swagger
  * /contacts/{contactId}:
  *   put:
  *     parameters:
  *       - in: path
  *         name: contactId
  *       - in: body
  *         name: contact
  *         description: The contact to create.
  *         schema:
  *           $ref: "#/definitions/Contact"
  *     description: Creates a new contact
  *     security:
  *       - BearerAuth: []
  *     responses:
  *       202:
  *         description: Contact updated
  *       400:
  *         description: Error - missing data
  *       500:
  *         description: Error - general problem
  */
  router.put('/:contactId', async (req, res) => {
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
      const updatedContact =
        await ContactService.update(req.body, req.params.contactId, req.user._id);
      return res.status(202).json({ data: updatedContact });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });

  return router;
};

