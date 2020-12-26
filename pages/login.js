import {useState} from "react";
import Typography from "@material-ui/core/Typography";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Figure from "react-bootstrap/Figure";
import Form from "react-bootstrap/Form"
import auth from "solid-auth-client";
import Alert from "react-bootstrap/Alert"
import BaseLayout from "../components/base_layout";
import {getSession} from "../functions/getSession";
import {useRouter} from "next/router";
import ModalAlert from "../components/modalAlert";

export default function Login({session, setSession}) {
  const [provider, setProvider] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Ocurrió un error");
  const router = useRouter();

  const identityProviderFormSubmit = async () => {
    cleanError();
    if (provider) {
      let currentSession = await getSession();
      if (!currentSession) {
        await auth.login(provider);
      }
    } else {
      showError("Debe seleccionar un proveedor");
    }
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setError(true);
  };
  const cleanError = () => {
    setError(false);
    setErrorMsg("Ocurrió un error");
  };

  return (
    <BaseLayout pageTitle="Autenticación">
      <Row>
        <Col className="text-center">
          <Figure>
            <Figure.Image
              width={200}
              height={200}
              alt="Agro-SOLID Logo"
              src="/static/images/agro-solid-logo.png"
            />
            <Figure.Caption>
              <Typography gutterBottom
                          variant="h4"
                          className="font-weight-bold text-white"
              >
                Agro-SOLID
              </Typography>
            </Figure.Caption>
          </Figure>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col className="text-center" xl={6} lg={6} md={6} sm={9} xs={9}>
          <Typography gutterBottom
                      variant="h6"
                      className="text-white-50"
          >
            Identificación
          </Typography>
          <Form>
            <Form.Group controlId="identityProviderForm.providerSelect">
              <Form.Label>
                <Typography gutterBottom
                            variant="subtitle1"
                            className="text-white"
                >
                  Proveedor de WebID
                </Typography>
              </Form.Label>
              <Form.Control as="select"
                            value={provider}
                            onChange={(event) => setProvider(event.target.value)}
              >
                <option value="" disabled>Seleccionar</option>
                <option value="https://inrupt.net">https://inrupt.net</option>
                <option value="https://solidcommunity.net">https://solidcommunity.net</option>
                <option value="https://solidweb.org">https://solidweb.org</option>
              </Form.Control>
            </Form.Group>
          </Form>
          <Alert closeLabel="Cerrar"
                 variant="danger"
                 show={error}
                 dismissible
                 onClose={() => setError(false)}
                 className="text-left"
          >
            <Alert.Heading>Error</Alert.Heading>
            <Typography gutterBottom
                        variant="body1"
            >
              {errorMsg}
            </Typography>
          </Alert>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col className="text-center" xl={2} lg={2} md={2} sm={3} xs={5}>
          <Button variant="black"
                  block
                  onClick={() => setProvider("")}
          >
            <Typography variant="button">
              Limpiar
            </Typography>
          </Button>
        </Col>
        <Col className="text-center" xl={2} lg={2} md={2} sm={3} xs={5}>
          <Button variant="primary"
                  block
                  onClick={identityProviderFormSubmit}
          >
            <Typography variant="button">
              Aceptar
            </Typography>
          </Button>
        </Col>
      </Row>
      <ModalAlert show={!!session}
                  onHide={() => router.push("/")}
                  variant="success"
                  title="Se encuentra autenticado"
                  msg={`Con el siguiente WebID ${session ? session.webId : null}`}

      />
    </BaseLayout>
  );
}