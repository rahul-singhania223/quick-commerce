import { Store, User } from "../../generated/prisma/client.ts";

declare global {
  namespace Express {
    interface Request {
      user?: Partial<User>;
      store?: Store;
    }
  }
}
