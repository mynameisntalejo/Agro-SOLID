import BaseLayout from "../components/base_layout";
import NavigationBar from "../components/navbar"
import {Button, Card, Container, Spinner} from "react-bootstrap";
import Typography from "@material-ui/core/Typography";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Row from "react-bootstrap/Row";
import {saveFarmData} from "../functions/saveFarmData";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import {useRouter} from "next/router";
import LoaderSpinner from "../components/loaderSpinner";
import ModalAlert from "../components/modalAlert";

export default function Farm({session, setSession}) {
  const [farmName, setFarmName] = useState("");
  const [farmSurface, setFarmSurface] = useState("");
  const [farmPlots, setFarmPlots] = useState([]);
  const [plotName, setPlotName] = useState("");
  const [plotSurface, setPlotSurface] = useState("");
  const [renderFarmPlots, setRenderFarmPlots] = useState(true);
  const [disabledSaveFarm, setDisabledSaveFarm] = useState(true);
  const [savingFarm, setSavingFarm] = useState(false);
  const [successSaveFarm, setSuccessSaveFarm] = useState(false);
  const router = useRouter();

  const farmNameOnChange = (event) => {
    setFarmName(event.target.value);
  };

  const farmSurfaceOnChange = (event) => {
    setFarmSurface(event.target.value);
  };

  const farmPlotNameOnChange = (event) => {
    setPlotName(event.target.value);
  };

  const farmPlotSurfaceOnChange = (event) => {
    setPlotSurface(event.target.value);
  };

  const addFarmPlot = () => {
    setRenderFarmPlots(false);
    setFarmPlots([...farmPlots, {name: plotName, surface: plotSurface}]);
    setPlotName("");
    setPlotSurface("");
  };

  const removeFarmPlot = (index) => {
    setRenderFarmPlots(false);
    setFarmPlots(farmPlots.filter((plot, idx) => idx !== index));
  };

  useEffect(() => {
    setRenderFarmPlots(true);
  }, [farmPlots]);

  useEffect(() => {
    setDisabledSaveFarm(!(farmName && farmSurface && farmPlots.length));
  }, [farmName, farmSurface, farmPlots]);

  const submitSaveFarm = async () => {
    setDisabledSaveFarm(true);
    setSavingFarm(true);
    await saveFarmData(session.webId, farmName, farmSurface, farmPlots);
    setSavingFarm(false);
    setDisabledSaveFarm(false);
    setSuccessSaveFarm(true);
  }

  return (
    <BaseLayout pageTitle="Nuevo campo">
      <NavigationBar setSession={setSession}/>
      <Container fluid className="py-5">
        <Card>
          <Card.Header>
            <Typography variant="button">
              Nuevo campo
            </Typography>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Row>
                <Form.Group as={Col}
                            controlId="farmName"
                >
                  <Form.Label>
                    <Typography variant="overline"
                                className="font-weight-bold"
                    >
                      Nombre
                    </Typography>
                  </Form.Label>
                  <Form.Control placeholder="Ingresar"
                                value={farmName}
                                onChange={farmNameOnChange}
                  />
                </Form.Group>
                <Form.Group as={Col}
                            controlId="farmSurface"
                >
                  <Form.Label>
                    <Typography variant="overline"
                                className="font-weight-bold"
                    >
                      Superficie (en km²)
                    </Typography>
                  </Form.Label>
                  <Form.Control type="number"
                                placeholder="Ingresar"
                                value={farmSurface}
                                onChange={farmSurfaceOnChange}
                  />
                </Form.Group>
              </Form.Row>
              <Card>
                <Card.Header>
                  <Typography variant="overline"
                              className="font-weight-bold"
                  >
                    Parcelas
                  </Typography>
                </Card.Header>
                <Card.Body>
                  {
                    !renderFarmPlots &&
                    <Row className="mb-3">
                      <Col className="text-center">
                        <LoaderSpinner variant="dark"
                                       size="lg"
                                       srmsg="Cargando"
                        />
                      </Col>
                    </Row>
                  }
                  {
                    renderFarmPlots &&
                    farmPlots.map(
                      (plot, index) => {
                        return (
                          <Form.Row key={index}
                                    className="align-items-center border rounded mb-3"
                          >
                            <Form.Group as={Col}
                                        controlId={`farmPlotName${index}`}
                                        className="my-2"
                            >
                              <Form.Label>
                                <Typography variant="overline"
                                            className="font-weight-bold"
                                >
                                  Nombre
                                </Typography>
                              </Form.Label>
                              <Form.Control plaintext
                                            readOnly
                                            defaultValue={plot.name}
                              />
                            </Form.Group>
                            <Form.Group as={Col}
                                        controlId={`farmPlotSurface${index}`}
                                        className="my-2"
                            >
                              <Form.Label>
                                <Typography variant="overline"
                                            className="font-weight-bold"
                                >
                                  Superficie (en km²)
                                </Typography>
                              </Form.Label>
                              <Form.Control plaintext
                                            readOnly
                                            defaultValue={plot.surface}
                              />
                            </Form.Group>
                            <Col xs={2}
                                 className="text-center"
                            >
                              <Button variant="danger"
                                      className="rounded-circle"
                                      onClick={() => removeFarmPlot(index)}
                              >
                                <FontAwesomeIcon icon="minus"
                                                 className="mx-auto my-1 fa-w-10"
                                />
                              </Button>
                            </Col>
                          </Form.Row>
                        );
                      }
                    )
                  }
                  <Form.Row className="align-items-center border rounded">
                    <Form.Group as={Col}
                                controlId="farmPlotName"
                                className="my-2"
                    >
                      <Form.Label>
                        <Typography variant="overline"
                                    className="font-weight-bold"
                        >
                          Nombre
                        </Typography>
                      </Form.Label>
                      <Form.Control placeholder="Ingresar"
                                    value={plotName}
                                    onChange={farmPlotNameOnChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col}
                                controlId="farmPlotSurface"
                                className="my-2"
                    >
                      <Form.Label>
                        <Typography variant="overline"
                                    className="font-weight-bold"
                        >
                          Superficie (en km²)
                        </Typography>
                      </Form.Label>
                      <Form.Control type="number"
                                    placeholder="Ingresar"
                                    value={plotSurface}
                                    onChange={farmPlotSurfaceOnChange}
                      />
                    </Form.Group>
                    <Col xs={2}
                         className="text-center"
                    >
                      <Button variant="success"
                              className="rounded-circle"
                              disabled={!(plotName && plotSurface)}
                              onClick={addFarmPlot}
                      >
                        <FontAwesomeIcon icon="plus"
                                         className="mx-auto my-1 fa-w-10"
                        />
                      </Button>
                    </Col>
                  </Form.Row>
                </Card.Body>
              </Card>
              <Form.Row className="mt-3">
                <Form.Group as={Col}
                            controlId="saveFarm"
                >
                  <Button variant="primary"
                          block
                          disabled={disabledSaveFarm}
                          onClick={submitSaveFarm}
                  >
                    {
                      !savingFarm &&
                      <Typography variant="button">
                        Guardar
                      </Typography>
                    }
                    {
                      savingFarm &&
                      <LoaderSpinner variant="light"
                                     size="sm"
                                     srmsg="Guardando"
                      />
                    }
                  </Button>
                </Form.Group>
              </Form.Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <ModalAlert show={successSaveFarm}
                  onHide={() => router.push("/profile")}
                  variant="success"
                  title="¡Éxito!"
                  msg="Se dió de alta un nuevo campo correctamente"

      />
    </BaseLayout>
  );
}