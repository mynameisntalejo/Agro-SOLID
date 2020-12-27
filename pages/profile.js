import BaseLayout from "../components/baseLayout";
import NavigationBar from "../components/navbar"
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import ProfileDataForm from "../components/profileDataForm";
import ProfileFarmData from "../components/profileFarmData";

export default function Profile({session, setSession}) {

  return (
    <BaseLayout pageTitle="Mis datos">
      <NavigationBar setSession={setSession}/>
      <Container fluid className="py-5">
        <Accordion defaultActiveKey="person">
          <Card>
            <Accordion.Toggle as={Card.Header}
                              eventKey="person"
            >
              <Typography variant="button">
                <FontAwesomeIcon icon="hiking"
                                 className="mx-3 fa-w-20"
                /> Mis datos
              </Typography>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="person">
              <Card.Body>
                <ProfileDataForm session={session}/>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header}
                              eventKey="farm"
            >
              <Typography variant="button">
                <FontAwesomeIcon icon="tractor"
                                 className="mx-3 fa-w-20"
                /> Mis campos
              </Typography>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="farm">
              <Card.Body>
                <ProfileFarmData session={session}/>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Container>
    </BaseLayout>
  );
}