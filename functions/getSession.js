import auth from "solid-auth-client";
import {saveUser} from "./saveUser";

export const getSession = async () => {
  let tracksession = null;
  await auth.trackSession(
    (session) => {
      tracksession = session;
      if (tracksession) {
        saveUser(tracksession.webId);
      }
    }
  );
  return tracksession;
};
