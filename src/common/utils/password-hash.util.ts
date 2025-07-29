import * as bcrypt from 'bcrypt';

// Hashea una contraseña usando bcrypt con un salt de 10
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compara una contraseña en texto plano con su versión hasheada.
export const comparePassword = async (
  plainText: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(plainText, hashedPassword);
};
