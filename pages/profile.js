import BaseLayout from "../components/base_layout";
import {useEffect} from "react";
import {getDocument} from "../functions/getDocument";
import {foaf} from "rdf-namespaces";
import NavigationBar from "../components/navbar"
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Typography from "@material-ui/core/Typography";

export default function Profile({session, setSession}) {
  useEffect(() => {
    getDocument(session.webId).then(
      (document) => {
        if (document) {
          let profile = document.getSubject(session.webId);
          console.log(profile.getString(foaf.name));
        }
      }
    )
  }, []);

  return (
    <BaseLayout pageTitle="Mis datos">
      <NavigationBar/>
      <Container fluid className="my-5">
        <Accordion>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="farm">
              <Typography variant="button">
                Mis granjas
              </Typography>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="farm">
              <Card.Body>
                <Typography variant="body1">
                  Mis granjas
                </Typography>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="person">
              <Typography variant="button">
                Mis datos
              </Typography>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="person">
              <Card.Body>
                <Typography variant="body1">
                  Mis datos
                </Typography>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Container>
    </BaseLayout>
  );
}