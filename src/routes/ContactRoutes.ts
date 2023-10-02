import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import ContactService, { ContactMessages } from "@src/services/ContactService"; // Import the ContactService
import { Contact } from "@src/entity/contact.entity"; // Import the Contact entity
import { IReq, IRes } from "./types/express/misc";
import { ContactDTO } from "@src/models/Contact"; // Import ContactDTO if needed

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - phoneNumber
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         firstName:
 *           type: string
 *           description: The first name of the contact
 *         lastName:
 *           type: string
 *           description: The last name of the contact
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the contact
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: 1
 *         firstName: John
 *         lastName: Joe
 *         phoneNumber: 07031632426
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

/**
 * Get one contact by phone.
 */

/**
 * @swagger
 * /api/contacts/{phoneNumber}:
 *   get:
 *     summary: Get one contact by phone number.
 *     tags:
 *       - Contacts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: phoneNumber
 *         required: true
 *         description: Phone number of the contact to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the contact.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 data:
 *                   type: object
 *                   properties:
 *                     contact:
 *                       $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */

async function getOne(req: IReq, res: IRes) {
  try {
    const phoneNumber = req.params.phoneNumber;
    const contact = await ContactService.getOne(phoneNumber);
    if (contact) {
      return res.status(HttpStatusCodes.OK).json({
        message: ContactMessages.Retrieved,
        data: {
          contact: contact,
        },
      });
    } else {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        message: ContactMessages.NotFound,
        data: null,
      });
    }
  } catch (error) {
    return res.status(error.status).json({
      message: error.message,
      data: null,
    });
  }
}
/**
 * Get all contacts.
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts.
 *     tags:
 *       - Contacts
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved contacts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 data:
 *                   type: object
 *                   properties:
 *                     contacts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Contact'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */

async function getAll(_: IReq, res: IRes) {
  try {
    const contacts = await ContactService.getAll();
    return res.status(HttpStatusCodes.OK).json({
      message: ContactMessages.Retrieved,
      data: {
        contacts: contacts,
      },
    });
  } catch (error) {
    return res
      .status(error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        message: error.message || "An error occurred while fetching contacts",
        data: null,
      });
  }
}

/**
 * Create one contact.
 */

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact.
 *     tags:
 *       - Contacts
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Login request body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             phoneNumber:
 *               type: string
 *     responses:
 *       201:
 *         description: Successfully created a new contact.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 data:
 *                   type: object
 *                   properties:
 *                     contact:
 *                       $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Bad request. Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
async function createOne(req: IReq<ContactDTO>, res: IRes) {
  try {
    const body = req.body;
    const returnContact = await ContactService.createOne(body);
    return res.status(HttpStatusCodes.CREATED).json({
      message: ContactMessages.Created,
      data: {
        contact: returnContact,
      },
    });
  } catch (error) {
    return res.status(error.status).json({
      message: error.message,
      data: null,
    });
  }
}

/**
 * Update one contact.
 */

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update a contact by ID.
 *     tags:
 *       - Contacts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact to update.
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Successfully updated the contact.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       400:
 *         description: Bad request. Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       404:
 *         description: Contact not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */

async function updateOne(req: IReq<Contact>, res: IRes) {
  try {
    const contact = req.body;
    await ContactService.updateOne(contact);
    return res.status(HttpStatusCodes.OK).json({
      message: ContactMessages.Updated,
      data: null,
    });
  } catch (error) {
    return res.status(error.status).json({
      message: error.message,
      data: null,
    });
  }
}

/**
 * Delete one contact by ID.
 */

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact by ID.
 *     tags:
 *       - Contacts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact to delete.
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Successfully deleted the contact.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       404:
 *         description: Contact not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */

async function deleteOne(req: IReq, res: IRes) {
  try {
    const contactId = Number(req.params.id);
    const deleted = await ContactService.deleteOne(contactId);
    if (deleted) {
      return res.status(HttpStatusCodes.OK).json({
        message: ContactMessages.Deleted,
        data: null,
      });
    } else {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        message: ContactMessages.NotFound,
        data: null,
      });
    }
  } catch (error) {
    return res.status(error.status).json({
      message: error.message,
      data: null,
    });
  }
}

export default {
  getOne,
  getAll,
  createOne,
  updateOne,
  deleteOne,
};
