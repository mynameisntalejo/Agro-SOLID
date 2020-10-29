import BaseLayout from "../components/base_layout";
import {useEffect} from "react";
import {getDocument} from "../functions/getDocument";
import {foaf} from "rdf-namespaces";
import NavigationBar from "../components/navbar"

export default function Profile({session, setSession}) {
    useEffect(() => {
        getDocument(session.webId).then(
            (document) => {
                let profile = document.getSubject(session.webId)
                console.log(profile.getString(foaf.name))
            }
        )
    }, []);

    return (
        <BaseLayout pageTitle="Mis datos">
            <NavigationBar/>
        </BaseLayout>
    );
}