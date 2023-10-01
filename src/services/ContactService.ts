import ContactRepo from "@src/repos/ContactRepo"; // Import the ContactRepo
import { Contact } from "@src/entity/contact.entity"; // Import the Contact entity
import { RouteError } from "@src/other/classes";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

// Error message
export const CONTACT_NOT_FOUND_ERR = "Contact not found";

// Get one contact by email
async function getOne(phoneNumber: string): Promise<Contact | null> {
  const contact = await ContactRepo.getOne(phoneNumber);

  if (!contact) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CONTACT_NOT_FOUND_ERR);
  }

  return contact;
}

// Get all contacts
function getAll(): Promise<Contact[]> {
  return ContactRepo.getAll();
}

// Create a new contact
function createOne(body: Partial<Contact>): Promise<Contact> {
  return ContactRepo.create(body);
}

// Update a contact
async function updateOne(contact: Contact): Promise<void> {
  const exists = await ContactRepo.exists(contact.id);
  if (!exists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CONTACT_NOT_FOUND_ERR);
  }
  await ContactRepo.update(contact.id, contact);
}

// Delete a contact by their id
async function deleteOne(id: number): Promise<boolean> {
  const exists = await ContactRepo.exists(id);
  if (!exists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CONTACT_NOT_FOUND_ERR);
  }
  return ContactRepo.delete(id);
}

export default {
  getAll,
  createOne,
  updateOne,
  deleteOne,
  getOne,
} as const;
