import BaseLayout from "../components/base_layout";
import {useEffect} from "react";
import {getDocument} from "../functions/getDocument";
import NavigationBar from "../components/navbar"
import auth from "solid-auth-client";
import {useRouter} from "next/router";

export default function Index({session, setSession}) {
  const router = useRouter();

  const logout = () => {
    auth.logout().then(
      () => {
        setSession(false);
        router.push("/login");
      }
    )
  }

  useEffect(() => {
    if (session) {
      getDocument(session.webId).then(
        (document) => {
          if (document) {
            let profile = document.getSubject(session.webId);
          }
        }
      );
    }
  }, []);

  return (
    <BaseLayout pageTitle="Inicio">
      <NavigationBar logout={logout}/>
    </BaseLayout>
  );
}