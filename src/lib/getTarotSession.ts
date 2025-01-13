import { getSession } from "./session";
import { SessionData } from "@/types/session";

export async function getTarotSession(): Promise<SessionData> {
  return await getSession();
}
