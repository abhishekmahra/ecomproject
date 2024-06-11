import { compareSync} from "bcrypt-ts";
export function comparePassword(password: string, hash: string) {
    return compareSync(password , hash)
  }
