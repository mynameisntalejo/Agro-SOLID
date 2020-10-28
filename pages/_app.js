import "fontsource-roboto"
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css"
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getSession} from "../functions/getSession";

function MyApp({Component, pageProps}) {
    const [session, setSession] = useState(false);
    const router = useRouter();

    useEffect(() => {
        getSession().then(
            (currentSession) => {
                currentSession ? setSession(currentSession) : router.push("/login");
            }
        )
    }, []);

    return (
        <Component {...pageProps} session={session} setSession={setSession}/>
    );
}

export default MyApp
