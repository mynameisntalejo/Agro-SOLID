import "fontsource-roboto";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../components/faLibrary";
import LoaderSpinner from "../components/loaderSpinner";
import {checkAgroSolidDocument} from "../functions/checkAgroSolidDocument";
import {getSession} from "../functions/getSession";
import {getDocument} from "../functions/getDocument";

function MyApp({Component, pageProps}) {
  const [session, setSession] = useState(false);
  const [render, setRender] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      let currentSession = await getSession();
      if (currentSession) {
        setSession(currentSession);
        await checkAgroSolidDocument(currentSession.webId);
      } else {
        await router.push("/login");
      }
      setRender(true);
    }
    fetchSession();
  }, []);

  if (render) {
    return <Component {...pageProps} session={session} setSession={setSession}/>;
  } else {
    return (
      <Container fluid className="pt-5">
        <Row className="pt-5">
          <Col className="text-center pt-5">
            <LoaderSpinner variant="light"
                           size="lg"
                           srmsg="Cargando"
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default MyApp
