import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData } from "@/types/session";

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: "tarot-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  return session;
}

export async function saveSession(session: SessionData) {
  const currentSession = await getSession();
  Object.assign(currentSession, session);
  await currentSession.save();
}

export async function clearSession() {
  const session = await getSession();
  session.destroy();
}
