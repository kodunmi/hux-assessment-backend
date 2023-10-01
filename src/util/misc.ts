/**
 * Miscellaneous shared functions go here.
 */

/**
 * Get a random number between 1 and 1,000,000,000,000
 */
export function getRandomInt(): number {
  return Math.floor(Math.random() * 1_000_000_000_000);
}

/**
 * Wait for a certain number of milliseconds.
 */
export function tick(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

export function validatePhoneNumber(arg: unknown): boolean {
  // Remove any non-digit characters
  if (typeof arg !== "string") {
    return false; // Email must be a string
  }
  const cleanedPhoneNumber = arg.replace(/\D/g, "");

  // Check if the cleaned number matches the format
  // Either starts with '+234' followed by 10 digits
  // Or starts with '0' followed by 10 digits
  const regex = /^(?:\+234|0)\d{10}$/;
  return regex.test(cleanedPhoneNumber);
}
