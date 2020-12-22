import auth from "solid-auth-client";

export const getSession = async () => {
  let tracksession = null;
  await auth.trackSession(
    (session) => {
      tracksession = session;
    }
  );
  return tracksession;
};
