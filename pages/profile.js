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
import {Button, ListGroup, Spinner, Tab} from "react-bootstrap";
import {getProfileData} from "../functions/getProfileData";
import {editProfileData} from "../functions/editProfileData";
import {useRouter} from "next/router";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Row from "react-bootstrap/Row";
import {getProfileFarmsData} from "../functions/getProfileFarmsData";
import LoaderSpinner from "../components/loaderSpinner";

export default function Profile({session, setSession}) {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingProfileFarms, setLoadingProfileFarms] = useState(true);
  const [webId, setWebId] = useState("");
  const [webIdFirstName, setwebIdFirstName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [webIdLastName, setwebIdLastName] = useState("");
  const [lastName, setLastName] = useState("");
  const [farms, setFarms] = useState([]);
  const [disabledSaveProfile, setDisabledSaveProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoadingProfile(true);
    setLoadingProfileFarms(true);
    const fetchData = async () => {
      setLoadingProfile(true);
      if (session) {
        let [profileWebId, profileFirstName, profileLastName] = await getProfileData(session.webId);
        setWebId(profileWebId);
        setwebIdFirstName(profileFirstName);
        setFirstName(profileFirstName);
        setwebIdLastName(profileLastName);
        setLastName(profileLastName);
        setLoadingProfile(false);
        let profileFarms = await getProfileFarmsData(session.webId);
        setFarms(profileFarms);
        setLoadingProfileFarms(false);
      }
    }
    fetchData();
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
  }, [firstName, lastName]);

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
  };

  return (
    <BaseLayout pageTitle="Mis datos">
      <NavigationBar setSession={setSession}/>
      <Container fluid className="py-5">
        <Accordion defaultActiveKey="person">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="person">
              <Typography variant="button">
                <FontAwesomeIcon icon="hiking"
                                 className="mx-3 fa-w-20"
                /> Mis datos
              </Typography>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="person">
              <Card.Body>
                {
                  loadingProfile &&
                  <Row>
                    <Col className="text-center">
                      <LoaderSpinner variant="dark"
                                     size="lg"
                                     srmsg="Cargando"
                      />
                    </Col>
                  </Row>
                }
                {
                  !loadingProfile &&
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
                                  controlId="saveProfile"
                      >
                        <Button variant="primary"
                                block
                                disabled={disabledSaveProfile}
                                onClick={submitSaveProfile}
                        >
                          {
                            !savingProfile &&
                            <Typography variant="button">
                              Guardar
                            </Typography>
                          }
                          {
                            savingProfile &&
                            <LoaderSpinner variant="light"
                                           size="sm"
                                           srmsg="Guardando"
                            />
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
              <Typography variant="button">
                <FontAwesomeIcon icon="tractor"
                                 className="mx-3 fa-w-20"
                /> Mis campos
              </Typography>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="farm">
              <Card.Body>
                {
                  loadingProfileFarms &&
                  <Row>
                    <Col className="text-center">
                      <LoaderSpinner variant="dark"
                                     size="lg"
                                     srmsg="Cargando"
                      />
                    </Col>
                  </Row>
                }
                {
                  !loadingProfileFarms &&
                  <Tab.Container id="farmList"
                                 defaultActiveKey="#farm0"
                  >
                    <Row>
                      <Col xs={3}>
                        <ListGroup>
                          {
                            farms.map(
                              (farm, farmIndex) => {
                                return (
                                  <ListGroup.Item key={farmIndex}
                                                  action
                                                  href={`#farm${farmIndex}`}
                                  >
                                    <Typography variant="button">
                                      {farm.name}
                                    </Typography>
                                  </ListGroup.Item>
                                );
                              }
                            )
                          }
                        </ListGroup>
                      </Col>
                      <Col>
                        <Tab.Content>
                          {
                            farms.map(
                              (farm, farmIndex) => {
                                return (
                                  <Tab.Pane key={farmIndex}
                                            eventKey={`#farm${farmIndex}`}
                                  >
                                    <Tab.Container id={`#farm${farmIndex}PlotList`}
                                                   defaultActiveKey={`#farm${farmIndex}plot0`}
                                    >
                                      <Row>
                                        <Col xs={4}>
                                          <ListGroup>
                                            {
                                              farm.plots.map(
                                                (plot, plotIndex) => {
                                                  return (
                                                    <ListGroup.Item key={plotIndex}
                                                                    action
                                                                    href={`#farm${farmIndex}plot${plotIndex}`}
                                                    >
                                                      <Typography variant="button">
                                                        {plot.name}
                                                      </Typography>
                                                    </ListGroup.Item>
                                                  );
                                                }
                                              )
                                            }
                                          </ListGroup>
                                        </Col>
                                        <Col>
                                          <Tab.Content>
                                            {
                                              farm.plots.map(
                                                (plot, plotIndex) => {
                                                  return (
                                                    <Tab.Pane key={plotIndex}
                                                              eventKey={`#farm${farmIndex}plot${plotIndex}`}
                                                    >
                                                      <Card>
                                                        <Card.Header>
                                                          <Typography variant="button">
                                                            Campo "{farm.name}"
                                                          </Typography>
                                                        </Card.Header>
                                                        <Card.Body>
                                                          <Row className="mb-3">
                                                            <Col xs={8}>
                                                              <Typography variant="overline"
                                                                          className="font-weight-bold"
                                                              >
                                                                Nombre del campo
                                                              </Typography>
                                                              <Typography variant="body1">
                                                                {farm.name}
                                                              </Typography>
                                                              <Typography variant="overline"
                                                                          className="font-weight-bold"
                                                              >
                                                                Superficie del campo
                                                              </Typography>
                                                              <Typography variant="body1">
                                                                {farm.surface} km²
                                                              </Typography>
                                                              <Typography variant="overline"
                                                                          className="font-weight-bold"
                                                              >
                                                                Dueño del campo
                                                              </Typography>
                                                              <Typography variant="body1">
                                                                {farm.owner.firstName} {farm.owner.lastName}
                                                              </Typography>
                                                            </Col>
                                                            <Col>
                                                              <Row className="mb-3">
                                                                <Col>
                                                                  <Button variant="black"
                                                                          block
                                                                          onClick={() => console.log("editar")}
                                                                  >
                                                                    <Typography variant="button">
                                                                      Editar campo
                                                                    </Typography>
                                                                  </Button>
                                                                </Col>
                                                              </Row>
                                                              <Row>
                                                                <Col>
                                                                  <Button variant="danger"
                                                                          block
                                                                          onClick={() => console.log("eliminar")}
                                                                  >
                                                                    <Typography variant="button">
                                                                      Eliminar campo
                                                                    </Typography>
                                                                  </Button>
                                                                </Col>
                                                              </Row>
                                                            </Col>
                                                          </Row>
                                                          <Card>
                                                            <Card.Header>
                                                              <Typography variant="button">
                                                                <FontAwesomeIcon icon="box"
                                                                                 className="mx-3 fa-w-20"
                                                                /> Parcela "{plot.name}" en el campo "{farm.name}"
                                                              </Typography>
                                                            </Card.Header>
                                                            <Card.Body>
                                                              <Row>
                                                                <Col xs={8}>
                                                                  <Typography variant="overline"
                                                                              className="font-weight-bold"
                                                                  >
                                                                    Nombre de la parcela
                                                                  </Typography>
                                                                  <Typography variant="body1">
                                                                    {plot.name}
                                                                  </Typography>
                                                                  <Typography variant="overline"
                                                                              className="font-weight-bold"
                                                                  >
                                                                    Superficie de la parcela
                                                                  </Typography>
                                                                  <Typography variant="body1">
                                                                    {plot.surface} km²
                                                                  </Typography>
                                                                </Col>
                                                                <Col>
                                                                  <Button variant="white"
                                                                          block
                                                                          onClick={() => console.log("nuevo evento")}
                                                                  >
                                                                    <Typography variant="button">
                                                                      Agregar evento
                                                                    </Typography>
                                                                  </Button>
                                                                </Col>
                                                              </Row>
                                                              <Row>
                                                                <Col>
                                                                  <Typography variant="overline"
                                                                              className="font-weight-bold"
                                                                  >
                                                                    Eventos
                                                                  </Typography>
                                                                </Col>
                                                              </Row>
                                                            </Card.Body>
                                                          </Card>
                                                        </Card.Body>
                                                      </Card>
                                                    </Tab.Pane>
                                                  );
                                                }
                                              )
                                            }
                                          </Tab.Content>
                                        </Col>
                                      </Row>
                                    </Tab.Container>
                                  </Tab.Pane>
                                );
                              }
                            )
                          }
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
                }
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Container>
    </BaseLayout>
  );
}