import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LoaderSpinner from "./loaderSpinner";
import Tab from "react-bootstrap/Tab";
import {ListGroup} from "react-bootstrap";
import Typography from "@material-ui/core/Typography";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";
import {getProfileFarmsData} from "../functions/getProfileFarmsData";

export default function ProfileFarmData({session}) {
  const [loadingProfileFarms, setLoadingProfileFarms] = useState(true);
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    setLoadingProfileFarms(true);
    const fetchFarmData = async () => {
      if (session) {
        let profileFarms = await getProfileFarmsData(session.webId);
        setFarms(profileFarms);
        setLoadingProfileFarms(false);
      }
    }
    fetchFarmData();
  }, [session]);

  if (loadingProfileFarms) {
    return (
      <Row>
        <Col className="text-center">
          <LoaderSpinner variant="dark"
                         size="lg"
                         srmsg="Cargando"
          />
        </Col>
      </Row>
    )
  } else {
    return (
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
                                                  <Typography gutterBottom
                                                              variant="body1"
                                                  >
                                                    {farm.name}
                                                  </Typography>
                                                  <Typography variant="overline"
                                                              className="font-weight-bold"
                                                  >
                                                    Superficie del campo
                                                  </Typography>
                                                  <Typography gutterBottom
                                                              variant="body1"
                                                  >
                                                    {farm.surface} km²
                                                  </Typography>
                                                  <Typography variant="overline"
                                                              className="font-weight-bold"
                                                  >
                                                    Dueño del campo
                                                  </Typography>
                                                  <Typography gutterBottom
                                                              variant="body1"
                                                  >
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
                                                      <Typography gutterBottom
                                                                  variant="body1"
                                                      >
                                                        {plot.name}
                                                      </Typography>
                                                      <Typography variant="overline"
                                                                  className="font-weight-bold"
                                                      >
                                                        Superficie de la parcela
                                                      </Typography>
                                                      <Typography gutterBottom
                                                                  variant="body1"
                                                      >
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
    )
  }
}