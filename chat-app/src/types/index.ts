import { Message, User } from "@prisma/client";

export interface Messages extends Message {
  user?: User;
}
// export interface Messages extends Message {
//   user: User;
// }
