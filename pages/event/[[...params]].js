import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Typography from "@material-ui/core/Typography";
import {rdf} from "rdf-namespaces";
import * as ags from "../../owl";
import BaseLayout from "../../components/baseLayout";
import LoaderSpinner from "../../components/loaderSpinner";
import ModalAlert from "../../components/modalAlert";
import NavigationBar from "../../components/navbar"
import {createCrop} from "../../functions/createCrop";
import {getCrops} from "../../functions/getCrops";
import {getDocument} from "../../functions/getDocument";
import {saveEventData} from "../../functions/saveEventData";

export default function Event({session, setSession}) {
  const [crops, setCrops] = useState([]);
  const [farmName, setFarmName] = useState("");
  const [plotName, setPlotName] = useState("");
  const [eventType, setEventType] = useState("Seleccionar");
  const [eventCrop, setEventCrop] = useState("Seleccionar");
  const [eventOtherCrop, setEventOtherCrop] = useState("");
  const [eventQuantity, setEventQuantity] = useState("");
  const [eventTimestamp, setEventTimestamp] = useState({date: "", time: ""});
  const [loadingEventForm, setLoadingEventForm] = useState(true);
  const [disabledSaveEvent, setDisabledSaveEvent] = useState(true);
  const [savingEvent, setSavingEvent] = useState(false);
  const [successSaveEvent, setSuccessSaveEvent] = useState(false);
  const router = useRouter();
  const [farmDocumentUri, plotDocumentUri] = router.query.params && router.query.params.length === 2 ? router.query.params : []

  useEffect(() => {
    setLoadingEventForm(true);
    const fetchCropsData = async () => {
      let cropsData = await getCrops();
      setCrops(cropsData);
      setLoadingEventForm(false);
    };
    fetchCropsData();
  }, []);

  useEffect(() => {
    setLoadingEventForm(true);
    const fetchFarmPlotData = async () => {
      let webIdRoot = `${session.webId.split("/profile/card#me")[0]}`;
      let farmDocument = await getDocument(`${webIdRoot}/${farmDocumentUri}`);
      for (const farm of farmDocument.findSubjects(rdf.type, ags.Farm)) {
        setFarmName(farm.getString(ags.name));
      }
      let plotDocument = await getDocument(`${webIdRoot}/${plotDocumentUri}`);
      for (const plot of plotDocument.findSubjects(rdf.type, ags.Plot)) {
        setPlotName(plot.getString(ags.name));
      }
      setLoadingEventForm(false);
    }
    if (farmDocumentUri && plotDocumentUri) {
      fetchFarmPlotData();
    }
  }, [session, farmDocumentUri, plotDocumentUri]);

  useEffect(() => {
    eventType !== "Seleccionar" && eventCrop !== "Seleccionar" && eventQuantity && eventTimestamp.date && eventTimestamp.time ?
      eventCrop !== "Otro" || (eventCrop === "Otro" && eventOtherCrop) ?
        setDisabledSaveEvent(false)
        : setDisabledSaveEvent(true)
      : setDisabledSaveEvent(true)
  }, [eventType, eventCrop, eventOtherCrop, eventQuantity, eventTimestamp]);

  const eventTypeOnChange = (event) => {
    setEventType(event.target.value);
  };

  const eventCropOnChange = (event) => {
    setEventOtherCrop("");
    setEventCrop(event.target.value);
  };

  const eventOtherCropOnChange = (event) => {
    setEventOtherCrop(event.target.value);
  };

  const eventQuantityOnChange = (event) => {
    setEventQuantity(event.target.value);
  };

  const eventDateOnChange = (event) => {
    setEventTimestamp({...eventTimestamp, ...{date: event.target.value}});
  };

  const eventTimeOnChange = (event) => {
    setEventTimestamp({...eventTimestamp, ...{time: event.target.value}});
  };

  const submitSaveEvent = async () => {
    setDisabledSaveEvent(true);
    setSavingEvent(true);
    let cropName = eventCrop === "Otro" ? eventOtherCrop.charAt(0).toUpperCase() + eventOtherCrop.slice(1) : eventCrop;
    if (cropName !== "Otro") {
      let cropRef;
      let cropData = crops.find(crop => crop.name === cropName);
      cropRef = cropData ? cropData.documentUri : await createCrop(cropName);
      await saveEventData(session.webId, plotDocumentUri, eventType, cropRef, eventQuantity, eventTimestamp);
      setSuccessSaveEvent(true);
    }
    setSavingEvent(false);
    setDisabledSaveEvent(false);
  }

  return (
    <BaseLayout pageTitle="Nuevo evento">
      <NavigationBar setSession={setSession}/>
      <Container fluid className="py-5">
        <Card>
          <Card.Header>
            <Typography variant="button">
              Nuevo evento
            </Typography>
          </Card.Header>
          <Card.Body>
            {
              loadingEventForm &&
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
              !loadingEventForm &&
              <Form>
                <Form.Row>
                  <Form.Group as={Col}
                              controlId="farmName"
                  >
                    <Form.Label>
                      <Typography variant="overline"
                                  className="font-weight-bold"
                      >
                        Campo
                      </Typography>
                    </Form.Label>
                    <Form.Control plaintext
                                  readOnly
                                  defaultValue={farmName}
                    />
                  </Form.Group>
                  <Form.Group as={Col}
                              controlId="plotName"
                  >
                    <Form.Label>
                      <Typography variant="overline"
                                  className="font-weight-bold"
                      >
                        Parcela
                      </Typography>
                    </Form.Label>
                    <Form.Control plaintext
                                  readOnly
                                  defaultValue={plotName}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col}
                              controlId="eventType"
                  >
                    <Form.Label>
                      <Typography variant="overline"
                                  className="font-weight-bold"
                      >
                        Tipo
                      </Typography>
                    </Form.Label>
                    <Form.Control as="select"
                                  value={eventType}
                                  onChange={eventTypeOnChange}
                    >
                      <option disabled>Seleccionar</option>
                      <option>Siembra</option>
                      <option>Cosecha</option>
                    </Form.Control>
                  </Form.Group>
                  <Col>
                    <Form.Row>
                      <Form.Group as={Col}
                                  controlId="eventCrop"
                      >
                        <Form.Label>
                          <Typography variant="overline"
                                      className="font-weight-bold"
                          >
                            Cultivo
                          </Typography>
                        </Form.Label>
                        <Form.Control as="select"
                                      value={eventCrop}
                                      onChange={eventCropOnChange}
                        >
                          <option disabled>Seleccionar</option>
                          {
                            crops.map(
                              (crop, index) => {
                                return (
                                  <option key={index}>{crop.name}</option>
                                );
                              }
                            )
                          }
                          <option>Otro</option>
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                    {
                      eventCrop === "Otro" &&
                      <Form.Row>
                        <Form.Group as={Col}
                                    controlId="eventOtherCrop"
                        >
                          <Form.Label>
                            <Typography variant="overline"
                                        className="font-weight-bold"
                            >
                              Nombre del cultivo
                            </Typography>
                          </Form.Label>
                          <Form.Control placeholder="Ingresar"
                                        value={eventOtherCrop}
                                        onChange={eventOtherCropOnChange}
                          />
                        </Form.Group>
                      </Form.Row>
                    }
                  </Col>
                  <Form.Group as={Col} xs={2}
                              controlId="eventQuantity"
                  >
                    <Form.Label>
                      <Typography variant="overline"
                                  className="font-weight-bold"
                      >
                        Cantidad
                      </Typography>
                    </Form.Label>
                    <Form.Control type="number"
                                  placeholder="Ingresar"
                                  value={eventQuantity}
                                  onChange={eventQuantityOnChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} xs={2}
                              controlId="eventDate"
                  >
                    <Form.Label>
                      <Typography variant="overline"
                                  className="font-weight-bold"
                      >
                        Fecha
                      </Typography>
                    </Form.Label>
                    <Form.Control type="date"
                                  value={eventTimestamp.date}
                                  onChange={eventDateOnChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} xs={2}
                              controlId="eventTime"
                  >
                    <Form.Label>
                      <Typography variant="overline"
                                  className="font-weight-bold"
                      >
                        Hora
                      </Typography>
                    </Form.Label>
                    <Form.Control type="time"
                                  value={eventTimestamp.time}
                                  onChange={eventTimeOnChange}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row className="mt-3">
                  <Form.Group as={Col}
                              controlId="saveEvent"
                  >
                    <Button variant="primary"
                            block
                            disabled={disabledSaveEvent}
                            onClick={submitSaveEvent}
                    >
                      {
                        !savingEvent &&
                        <Typography variant="button">
                          Guardar
                        </Typography>
                      }
                      {
                        savingEvent &&
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
        </Card>
      </Container>
      <ModalAlert show={successSaveEvent}
                  onConfirm={() => router.push("/profile")}
                  variant="success"
                  title="¡Éxito!"
                  msg="Se dió de alta un nuevo evento correctamente"
      />
    </BaseLayout>
  );
}