import { hash } from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await hash(password, saltRounds);
};
