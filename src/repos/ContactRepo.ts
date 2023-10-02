import { Contact } from "@src/entity/contact.entity"; // Import the Contact entity
import { myDataSource } from "@src/app-data-source";
import { RouteError } from "@src/other/classes";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { Errors } from "@src/services/AuthService";

// Get one contact by phone
async function getOne(phoneNumber: string): Promise<Contact | null> {
  const contact = await myDataSource.getRepository(Contact).findOne({
    where: { phoneNumber: phoneNumber },
  });

  return contact;
}

// Get one contact by id
async function getOneById(id: number): Promise<Contact | null> {
  const contact = await myDataSource.getRepository(Contact).findOne({
    where: { id: id },
  });

  return contact;
}

async function exists(id: number): Promise<Contact | null> {
  const contact = await myDataSource.getRepository(Contact).findOne({
    where: { id: id },
  });

  return contact;
}

// Get all contacts
async function getAll(): Promise<Contact[]> {
  const contacts = await myDataSource.getRepository(Contact).find({
    order: {
      createdAt: "DESC",
      // id: "DESC",
    },
  });

  return contacts;
}

// Create a new contact
async function create(contactData: Partial<Contact>): Promise<Contact> {
  const existingContact = await getOne(contactData.phoneNumber as string);

  if (existingContact) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, Errors.DuplicateContact);
  }

  const contactObj = myDataSource.getRepository(Contact).create(contactData);
  const result = await myDataSource.getRepository(Contact).save(contactObj);

  return result;
}

// Update a contact
async function update(
  contactId: number,
  contactData: Partial<Contact>
): Promise<void> {
  const contact = await myDataSource.getRepository(Contact).findOneBy({
    id: contactId,
  });

  if (!contact) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.ContactNotFound);
  }

  myDataSource.getRepository(Contact).merge(contact, contactData);
  await myDataSource.getRepository(Contact).save(contact);
}

// Delete a contact
async function deleteContact(contactId: number): Promise<boolean> {
  const result = await myDataSource.getRepository(Contact).delete(contactId);

  return result.affected ? true : false;
}

export default {
  getOne,
  getAll,
  create,
  update,
  delete: deleteContact,
  exists,
  getOneById,
} as const;
