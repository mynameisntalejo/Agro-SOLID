import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Typography from "@material-ui/core/Typography";
import BaseLayout from "../../components/baseLayout";
import LoaderSpinner from "../../components/loaderSpinner";
import ModalAlert from "../../components/modalAlert";
import NavigationBar from "../../components/navbar"
import {getFarmData} from "../../functions/getFarmData";
import {getPrivacyRules} from "../../functions/getPrivacyRules";
import {getUsers} from "../../functions/getUsers";
import {saveFarmPrivacyData} from "../../functions/saveFarmPrivacyData";

export default function Privacy({session, setSession}) {
  const [agroSolidUsers, setAgroSolidUsers] = useState([]);
  const [farm, setFarm] = useState({});
  const [farmPlots, setFarmPlots] = useState([]);
  const [farmAllAccess, setFarmAllAccess] = useState(true);
  const [farmPrivacyRules, setFarmPrivacyRules] = useState({});
  const [farmSavedPrivacyRules, setFarmSavedPrivacyRules] = useState({});
  const [loadingFarmPrivacyForm, setLoadingFarmPrivacyForm] = useState(true);
  const [disabledSaveFarmPrivacy, setDisabledSaveFarmPrivacy] = useState(true);
  const [savingFarm, setSavingFarm] = useState(false);
  const [successSaveFarmPrivacy, setSuccessSaveFarmPrivacy] = useState(false);
  const router = useRouter();
  const [farmDocumentUri] = router.query.params && router.query.params.length === 1 ? router.query.params : []

  useEffect(() => {
    setLoadingFarmPrivacyForm(true);
    const fetchFarmData = async () => {
      if (farmDocumentUri) {
        let usersData = await getUsers();
        setAgroSolidUsers(usersData.filter((user, idx) => user.webId !== session.webId));
        let farmData = await getFarmData(session.webId, farmDocumentUri);
        setFarm((({documentUri, name}) => ({documentUri, name}))(farmData));
        setFarmPlots(farmData.plots);
      }
    };
    fetchFarmData();
  }, [session]);

  useEffect(() => {
    const fetchPrivacyRules = async () => {
      if (Object.keys(farm).length && farmPlots.length) {
        let privacyRules = await getPrivacyRules(session.webId, farm, farmPlots);
        setFarmSavedPrivacyRules(privacyRules);
        setFarmPrivacyRules(farmSavedPrivacyRules);
        setLoadingFarmPrivacyForm(false);
      }
    }
    fetchPrivacyRules();
  }, [farm, farmPlots]);

  useEffect(() => {
    let all = true;
    Object.keys(farmPrivacyRules).forEach(
      (key) => {
        if (!farmPrivacyRules[key].includes("Todos")) {
          all = false;
        }
      }
    );
    setFarmAllAccess(all);
  }, [farmPrivacyRules]);

  useEffect(() => {
    setDisabledSaveFarmPrivacy(!farmAllAccess && !Object.keys(farmPrivacyRules).length);
  }, [farmAllAccess, farmPrivacyRules]);

  const eventAllAccessOnChange = (event) => {
    let checked = event.target.checked;
    setFarmAllAccess(checked);
    let rules;
    if (checked) {
      let rulesOpen = {};
      Object.keys(farmPrivacyRules).forEach(
        (key) => {
          rulesOpen[key] = ["Todos"];
        }
      );
      rules = rulesOpen;
    } else {
      rules = farmSavedPrivacyRules;
    }
    setFarmPrivacyRules(rules);
  };

  const eventPrivacyRuleWhoOnChange = (event, object) => {
    let selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    selectedOptions = selectedOptions.includes("Ninguno") ? ["Ninguno"] : selectedOptions.includes("Todos") ? ["Todos"] : selectedOptions;
    setFarmPrivacyRules({...farmPrivacyRules, ...{[object.documentUri]: selectedOptions}})
  };

  const submitSaveFarmPrivacy = async () => {
    setDisabledSaveFarmPrivacy(true);
    setSavingFarm(true);
    await saveFarmPrivacyData(session.webId, farmPrivacyRules);
    setSavingFarm(false);
    setDisabledSaveFarmPrivacy(false);
    setSuccessSaveFarmPrivacy(true);
  }

  return (
    <BaseLayout pageTitle="Editar privacidad del campo">
      <NavigationBar setSession={setSession}/>
      <Container fluid className="py-5">
        <Card>
          <Card.Header>
            <Typography variant="button">
              Editar privacidad del campo {
              !farm.name &&
              <LoaderSpinner variant="dark"
                             size="sm"
                             srmsg="Cargando"
              />
            }{farm.name && farm.name}
            </Typography>
          </Card.Header>
          <Card.Body>
            {
              loadingFarmPrivacyForm &&
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
              !loadingFarmPrivacyForm &&
              <Form>
                <Card>
                  <Card.Header>
                    <Typography variant="overline"
                                className="font-weight-bold"
                    >
                      Configuración de la privacidad
                    </Typography>
                  </Card.Header>
                  <Card.Body>
                    <Form.Row>
                      <Form.Group as={Col}
                                  controlId="farmAllAccess"
                      >
                        <Form.Check type="checkbox">
                          <Form.Check.Input type="checkbox"
                                            checked={farmAllAccess}
                                            onChange={eventAllAccessOnChange}
                          />
                          <Form.Check.Label>
                            <Typography variant="body2"
                                        className="font-weight-bold"
                            >
                              Compartir la información del campo y sus parcelas con todos los usuarios
                            </Typography>
                          </Form.Check.Label>
                        </Form.Check>
                      </Form.Group>
                    </Form.Row>
                    {
                      !farmAllAccess &&
                      <>
                        <Form.Row className="align-items-center border rounded">
                          <Form.Group as={Col}
                                      controlId="farmPrivacyRuleWhatAll"
                                      className="my-2"
                          >
                            <Form.Label>
                              <Typography variant="overline"
                                          className="font-weight-bold"
                              >
                                Campo {farm.name}
                              </Typography>
                            </Form.Label>
                            <Form.Control as="select"
                                          multiple
                                          value={farmPrivacyRules[farm.documentUri]}
                                          onChange={(event) => eventPrivacyRuleWhoOnChange(event, farm)}
                            >
                              <option>Ninguno</option>
                              <option>Todos</option>
                              {
                                agroSolidUsers.map(
                                  (user, index) => {
                                    if (!(user.hidden)) {
                                      return (
                                        <option value={user.webId}
                                                key={index}
                                        >
                                          {(user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : `${user.webId}`}
                                        </option>
                                      );
                                    }
                                  }
                                )
                              }
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        {
                          farmPlots.map(
                            (plot, indexPlot) => {
                              return (
                                <Form.Row className="align-items-center border rounded"
                                          key={indexPlot}
                                >
                                  <Form.Group as={Col}
                                              controlId={`farmPrivacyRuleWhatAll${indexPlot}`}
                                              className="my-2"
                                  >
                                    <Form.Label>
                                      <Typography variant="overline"
                                                  className="font-weight-bold"
                                      >
                                        Parcela {plot.name}
                                      </Typography>
                                    </Form.Label>
                                    <Form.Control as="select"
                                                  multiple
                                                  value={farmPrivacyRules[plot.documentUri]}
                                                  onChange={(event) => eventPrivacyRuleWhoOnChange(event, plot)}
                                    >
                                      <option>Ninguno</option>
                                      <option>Todos</option>
                                      {
                                        agroSolidUsers.map(
                                          (user, index) => {
                                            if (!(user.hidden)) {
                                              return (
                                                <option value={user.webId}
                                                        key={`${indexPlot}${index}`}
                                                >
                                                  {(user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : `${user.webId}`}
                                                </option>
                                              );
                                            }
                                          }
                                        )
                                      }
                                    </Form.Control>
                                  </Form.Group>
                                </Form.Row>
                              );
                            }
                          )
                        }
                      </>
                    }
                  </Card.Body>
                </Card>
                <Form.Row className="mt-3">
                  <Form.Group as={Col}
                              controlId="saveFarmPrivacy"
                  >
                    <Button variant="primary"
                            block
                            disabled={disabledSaveFarmPrivacy}
                            onClick={submitSaveFarmPrivacy}
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
            }
          </Card.Body>
        </Card>
      </Container>
      <ModalAlert show={successSaveFarmPrivacy}
                  onConfirm={() => router.push("/profile")}
                  variant="success"
                  title="¡Éxito!"
                  msg={`Se ha actualizado la privacidad del campo correctamente`}

      />
    </BaseLayout>
  );
}