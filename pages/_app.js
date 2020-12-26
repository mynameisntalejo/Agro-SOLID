import "fontsource-roboto";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import "../components/faLibrary";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getSession} from "../functions/getSession";
import {checkAgroSolidDocument} from "../functions/checkAgroSolidDocument";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Spinner} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import LoaderSpinner from "../components/loaderSpinner";

function MyApp({Component, pageProps}) {
  const [session, setSession] = useState(false);
  const [render, setRender] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getSession().then(
      async (currentSession) => {
        if (currentSession) {
          setSession(currentSession);
          await checkAgroSolidDocument(currentSession.webId);
        } else {
          await router.push("/login");
        }
        setRender(true);
      }
    )
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
