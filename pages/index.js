import BaseLayout from "../components/base_layout";
import NavigationBar from "../components/navbar"

export default function Index({session, setSession}) {
  return (
    <BaseLayout pageTitle="Inicio">
      <NavigationBar setSession={setSession}/>
    </BaseLayout>
  );
}