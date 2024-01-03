
/**
 * @param password 
 * @returns boolean (true if password is valid and false if not)
 */

function check_password(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
}

/**
 * @param email 
 * @returns boolean (true if email is valid and false if not)
 */

function check_email(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export { check_password, check_email };