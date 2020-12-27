import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Typography from "@material-ui/core/Typography";
import LoaderSpinner from "./loaderSpinner";
import {editProfileData} from "../functions/editProfileData";
import {getDocument} from "../functions/getDocument";
import {getProfileData} from "../functions/getProfileData";

export default function ProfileDataForm({session}) {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [webId, setWebId] = useState("");
  const [webIdFirstName, setwebIdFirstName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [webIdLastName, setwebIdLastName] = useState("");
  const [lastName, setLastName] = useState("");
  const [disabledSaveProfile, setDisabledSaveProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoadingProfile(true);
    const fetchProfileData = async () => {
      if (session) {
        let [profileWebId, profileFirstName, profileLastName] = await getProfileData(session.webId);
        setWebId(profileWebId);
        setwebIdFirstName(profileFirstName);
        setFirstName(profileFirstName);
        setwebIdLastName(profileLastName);
        setLastName(profileLastName);
        setLoadingProfile(false);
      }
    }
    fetchProfileData();
  }, [session]);

  useEffect(() => {
    firstName && lastName ?
      !(firstName === webIdFirstName && lastName === webIdLastName) ?
        setDisabledSaveProfile(false)
        : setDisabledSaveProfile(true)
      : setDisabledSaveProfile(true)
  }, [firstName, lastName]);

  const firstNameOnChange = (event) => {
    setFirstName(event.target.value);
  };

  const lastNameOnChange = (event) => {
    setLastName(event.target.value);
  };

  const submitSaveProfile = async () => {
    setDisabledSaveProfile(true);
    setSavingProfile(true);
    let profileDocument = await getDocument(webId);
    if (profileDocument) {
      await editProfileData(profileDocument, webId, firstName, lastName);
      router.reload();
    }
  };

  if (loadingProfile) {
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
    )
  }
}