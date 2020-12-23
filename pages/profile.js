import BaseLayout from "../components/base_layout";
import {useEffect, useState} from "react";
import {getDocument} from "../functions/getDocument";
import NavigationBar from "../components/navbar"
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Typography from "@material-ui/core/Typography";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import {Button, Spinner} from "react-bootstrap";
import {getProfileData} from "../functions/getProfileData";
import {editProfileData} from "../functions/editProfileData";
import {useRouter} from "next/router";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Row from "react-bootstrap/Row";

export default function Profile({session, setSession}) {
  const [webId, setWebId] = useState("");
  const [webIdFirstName, setwebIdFirstName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [webIdLastName, setwebIdLastName] = useState("");
  const [lastName, setLastName] = useState("");
  const [disabledSaveProfile, setDisabledSaveProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      let currentWebId = session.webId;
      getDocument(currentWebId).then(
        (document) => {
          if (document) {
            let [profileWebId, profileFirstName, profileLastName] = getProfileData(document, currentWebId);
            setWebId(profileWebId);
            setwebIdFirstName(profileFirstName);
            setFirstName(profileFirstName);
            setwebIdLastName(profileLastName);
            setLastName(profileLastName);
          }
        }
      );
    }
  }, [session]);

  const firstNameOnChange = (event) => {
    setFirstName(event.target.value);
  };

  const lastNameOnChange = (event) => {
    setLastName(event.target.value);
  };

  useEffect(() => {
    firstName && lastName ?
      !(firstName === webIdFirstName && lastName === webIdLastName) ?
        setDisabledSaveProfile(false)
        : setDisabledSaveProfile(true)
      : setDisabledSaveProfile(true)
  }, [firstName, lastName])

  const submitSaveProfile = () => {
    setDisabledSaveProfile(true);
    setSavingProfile(true);
    if (session) {
      getDocument(webId).then(
        (document) => {
          editProfileData(document, webId, firstName, lastName).then(
            () => {
              router.reload();
            }
          )
        }
      );
    }
  }

  return (
    <BaseLayout pageTitle="Mis datos">
      <NavigationBar/>
      <Container fluid>
        <Accordion defaultActiveKey="person"
                   className="py-5"
        >
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="person">
              <Typography variant="button"
                          className="font-weight-bold"
              >
                <FontAwesomeIcon icon="hiking"
                                 className="mx-3 fa-w-20"
                /> Mis datos
              </Typography>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="person">
              <Card.Body>
                {
                  (webId === "") &&
                  <Row>
                    <Col className="text-center">
                      <Spinner animation="border"
                               variant="dark"
                               role="status"
                               size="lg"
                      >
                        <span className="sr-only">Cargando</span>
                      </Spinner>
                    </Col>
                  </Row>
                }
                {
                  !(webId === "") &&
                  <Form>
                    <Form.Row>
                      <Form.Group as={Col}
                                  controlId="webId"
                      >
                        <Form.Label>
                          <Typography variant="overline"
                                      className="font-weight-bold"
                          >
                            Web ID
                          </Typography>
                        </Form.Label>
                        <Form.Control plaintext
                                      readOnly
                                      defaultValue={webId}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col}
                                  controlId="webIdFirstName"
                      >
                        <Form.Label>
                          <Typography variant="overline"
                                      className="font-weight-bold"
                          >
                            Nombre
                          </Typography>
                        </Form.Label>
                        <Form.Control placeholder="Ingresar"
                                      value={firstName}
                                      onChange={firstNameOnChange}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col}
                                  controlId="webIdLastName"
                      >
                        <Form.Label>
                          <Typography variant="overline"
                                      className="font-weight-bold"
                          >
                            Apellido
                          </Typography>
                        </Form.Label>
                        <Form.Control placeholder="Ingresar"
                                      value={lastName}
                                      onChange={lastNameOnChange}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col}
                                  controlId="webIdLastName"
                      >
                        <Button variant="primary"
                                block
                                disabled={disabledSaveProfile}
                                onClick={submitSaveProfile}
                        >
                          {
                            !savingProfile &&
                            <Typography variant="button"
                                        className="font-weight-bold"
                            >
                              Guardar
                            </Typography>
                          }
                          {
                            savingProfile &&
                            <Spinner animation="border"
                                     variant="light"
                                     role="status"
                                     size="sm"
                            >
                              <span className="sr-only">Guardando</span>
                            </Spinner>
                          }
                        </Button>
                      </Form.Group>
                    </Form.Row>
                  </Form>
                }
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="farm">
              <Typography variant="button"
                          className="font-weight-bold"
              >
                <FontAwesomeIcon icon="tractor"
                                 className="mx-3 fa-w-20"
                /> Mis granjas
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
        </Accordion>
      </Container>
    </BaseLayout>
  );
}