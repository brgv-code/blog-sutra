import { makeVar } from "@apollo/client";
import { User } from "@/types/index";
export const currentUserVar = makeVar<User | null>(null);
