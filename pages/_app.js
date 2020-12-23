import "fontsource-roboto";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import "../components/faLibrary";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getSession} from "../functions/getSession";
import {checkAgroSolidDocument} from "../functions/checkAgroSolidDocument";

function MyApp({Component, pageProps}) {
  const [session, setSession] = useState(false);
  const [render, setRender] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getSession().then(
      (currentSession) => {
        if (!currentSession) {
          router.push("/login");
        }
        setSession(currentSession);
        checkAgroSolidDocument(currentSession.webId).then(
          () => {
            setRender(true);
          }
        );
      }
    )
  }, []);

  return (
    <>
      {
        render && <Component {...pageProps} session={session} setSession={setSession}/>
      }
    </>
  );
}

export default MyApp
