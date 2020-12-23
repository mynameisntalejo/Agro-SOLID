import BaseLayout from "../components/base_layout";
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

  return (
    <BaseLayout pageTitle="Inicio">
      <NavigationBar logout={logout}/>
    </BaseLayout>
  );
}