import {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Typography from "@material-ui/core/Typography";
import {rdf, rdfs} from "rdf-namespaces";
import * as ags from "../owl";
import BaseLayout from "../components/baseLayout";
import EventDataTable from "../components/eventDataTable";
import LoaderSpinner from "../components/loaderSpinner";
import NavigationBar from "../components/navbar"
import {getDocument} from "../functions/getDocument";
import {getUsers} from "../functions/getUsers";

export default function Index({session, setSession}) {
  const [loadingUsersData, setLoadingUsersData] = useState(true);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    setLoadingUsersData(true);
    const fetchUsersData = async () => {
      let data = [];
      let usersData = await getUsers();
      for (const user of usersData) {
        const owner = user.webId;
        let webIdRoot = `${owner.split("/profile/card#me")[0]}`;
        let agroSolidDocumentUri = `${webIdRoot}/agrosolid`;
        let agroSolidDocument = await getDocument(agroSolidDocumentUri);
        for (const triple of agroSolidDocument ? agroSolidDocument.findSubjects(rdfs.isDefinedBy, "") : []) {
          let farmData = {
            documentUri: "No compartido",
            name: "No compartido",
            surface: "No compartido",
            plots: [],
            owner: "No compartido"
          }
          let farmDocumentUri = triple.getRef(rdfs.isDefinedBy);
          let farmDocument = await getDocument(farmDocumentUri);
          for (const farm of farmDocument ? farmDocument.findSubjects(rdf.type, ags.Farm) : []) {
            let farmName = farm.getString(ags.name);
            let farmSurface = farm.getInteger(ags.surface);
            farmData = {
              ...farmData,
              ...{
                documentUri: farmDocumentUri.split(webIdRoot)[1],
                name: farmName,
                surface: farmSurface,
                owner: owner
              }
            }
            for (const plotDocumentUri of farm.getAllRefs(ags.hasPlot)) {
              let plotDocument = await getDocument(plotDocumentUri);
              for (const plot of plotDocument ? plotDocument.findSubjects(rdf.type, ags.Plot) : []) {
                let plotName = plot.getString(ags.name);
                let plotSurface = plot.getInteger(ags.surface);
                let plotData = {
                  documentUri: plotDocumentUri.split(webIdRoot)[1],
                  name: plotName,
                  surface: plotSurface,
                  events: [],
                  owner: owner
                }
                for (const eventRef of plot.getAllRefs(ags.hasEvent)) {
                  let event = plotDocument.getSubject(eventRef);
                  let eventType = event.getRef(rdf.type).split("#")[1].replaceAll("Sowing", "Siembra").replaceAll("Harvesting", "Cosecha");
                  let eventCrop = event.getRef(ags.hasCrop).split("#")[1];
                  let eventQuantity = event.getInteger(ags.quantity);
                  let eventTimestamp = (new Date(event.getInteger(ags.timestamp))).toLocaleString();
                  let eventData = {
                    type: eventType,
                    crop: eventCrop,
                    quantity: eventQuantity,
                    timestamp: eventTimestamp
                  }
                  plotData.events.push(eventData);
                }
                farmData.plots.push(plotData);
              }
            }
            data.push(farmData);
          }
        }
      }
      setUsersData(data);
      setLoadingUsersData(false);
    }
    fetchUsersData();
  }, []);

  return (
    <BaseLayout pageTitle="Inicio">
      <NavigationBar setSession={setSession}/>
      <Container fluid className="py-5">
        {
          loadingUsersData &&
          <Row className="mb-3">
            <Col className="text-center">
              <LoaderSpinner variant="light"
                             size="lg"
                             srmsg="Cargando"
              />
            </Col>
          </Row>
        }
        {
          !loadingUsersData &&
          usersData.map(
            (farm, index) => {
              return (
                <Card key={index}
                      className="my-4"
                >
                  <Card.Header>
                    <Typography variant="overline"
                                className="font-weight-bold"
                    >
                      {farm.name}
                    </Typography>
                  </Card.Header>
                  <Card.Body>
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
                      Dueño del campo (Web ID)
                    </Typography>
                    <Typography gutterBottom
                                variant="body1"
                    >
                      {farm.owner}
                    </Typography>
                    {
                      farm.plots.map(
                        (plot, index) => {
                          return (
                            <Card key={index}
                                  className="my-4"
                            >
                              <Card.Header>
                                <Typography variant="overline">
                                  {plot.name}
                                </Typography>
                              </Card.Header>
                              <Card.Body>
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
                                <Row>
                                  <Col>
                                    <Typography variant="overline"
                                                className="font-weight-bold"
                                    >
                                      Eventos
                                    </Typography>
                                    <EventDataTable data={plot.events}/>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          );
                        }
                      )
                    }
                  </Card.Body>
                </Card>
              );
            }
          )
        }
      </Container>
    </BaseLayout>
  );
}