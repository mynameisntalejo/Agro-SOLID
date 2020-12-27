import BaseLayout from "../components/baseLayout";
import NavigationBar from "../components/navbar"

export default function Index({session, setSession}) {
  return (
    <BaseLayout pageTitle="Inicio">
      <NavigationBar setSession={setSession}/>
    </BaseLayout>
  );
}