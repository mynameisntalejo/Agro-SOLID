import {useState} from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Typography from "@material-ui/core/Typography";
import LoaderSpinner from "./loaderSpinner";

export default function ModalAlert({show, onConfirm, onCancel, variant, title, msg}) {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = () => {
    setSubmitting(true);
    onConfirm();
  }

  return (
    <Modal show={show}
           onHide={() => onCancel ? onCancel() : onConfirm()}
           backdrop="static"
           keyboard={false}
    >
      <Modal.Body>
        <Alert closeLabel="Cerrar"
               variant={variant}
               show={true}
               className="text-left"
        >
          <Alert.Heading>
            {title}
          </Alert.Heading>
          <Typography gutterBottom
                      variant="body1"
          >
            {msg}
          </Typography>
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary"
                block
                onClick={onSubmit}
                disabled={submitting}
        >
          {
            !submitting &&
            <Typography variant="button">
              Aceptar
            </Typography>
          }
          {
            submitting &&
            <LoaderSpinner variant="light"
                           size="sm"
                           srmsg="Procesando"
            />
          }
        </Button>
        {
          onCancel &&
          <Button variant="black"
                  block
                  onClick={onCancel}
                  disabled={submitting}
          >
            <Typography variant="button">
              Cancelar
            </Typography>
          </Button>
        }
      </Modal.Footer>
    </Modal>
  )
}