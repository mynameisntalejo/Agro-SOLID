import auth from "solid-auth-client";

export const getSession = async () => {
    let currentSession = await auth.currentSession();
    if (currentSession) {
        return currentSession;
    }
    return false;
};
