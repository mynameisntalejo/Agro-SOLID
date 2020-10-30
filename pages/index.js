import BaseLayout from "../components/base_layout";
import {useEffect} from "react";
import {getDocument} from "../functions/getDocument";
import NavigationBar from "../components/navbar"

export default function Index({session, setSession}) {
    useEffect(() => {
        getDocument(session.webId).then(
            (document) => {
                if (document) {
                    let profile = document.getSubject(session.webId);
                }
            }
        )
    }, []);

    return (
        <BaseLayout pageTitle="Inicio">
            <NavigationBar/>
        </BaseLayout>
    );
}