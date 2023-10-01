import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import ContactService from "@src/services/ContactService"; // Import the ContactService
import { Contact } from "@src/entity/contact.entity"; // Import the Contact entity
import { IReq, IRes } from "./types/express/misc";
import { ContactDTO } from "@src/models/Contact"; // Import ContactDTO if needed

/**
 * Get one contact by email.
 */
async function getOne(req: IReq, res: IRes) {
  try {
    const phoneNumber = req.params.phoneNumber;
    const contact = await ContactService.getOne(phoneNumber);
    if (contact) {
      return res.status(HttpStatusCodes.OK).json({ contact });
    } else {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        message: "Contact not found",
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
async function getAll(_: IReq, res: IRes) {
  try {
    const contacts = await ContactService.getAll();
    return res.status(HttpStatusCodes.OK).json({
      message: "Contact retrieved successfully",
      data: {
        contact: contacts,
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
async function createOne(req: IReq<ContactDTO>, res: IRes) {
  try {
    const body = req.body;
    const returnContact = await ContactService.createOne(body);
    return res.status(HttpStatusCodes.CREATED).json({
      message: "Contact created successfully",
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
async function updateOne(req: IReq<Contact>, res: IRes) {
  try {
    const contact = req.body;
    await ContactService.updateOne(contact);
    return res.status(HttpStatusCodes.OK).json({
      message: "Contact updated successfully",
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
async function deleteOne(req: IReq, res: IRes) {
  try {
    const contactId = Number(req.params.id);
    const deleted = await ContactService.deleteOne(contactId);
    if (deleted) {
      return res.status(HttpStatusCodes.OK).json({
        message: "Contact deleted successfully",
        data: null,
      });
    } else {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        message: "Contact not found",
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
