// session.d.ts
import { SessionData } from 'express-session';

// Définissez ici les propriétés supplémentaires que vous souhaitez inclure dans la session
interface MySessionData extends session.SessionData {
  token?: string;
}

export default MySessionData;
