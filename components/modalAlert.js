import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Typography from "@material-ui/core/Typography";

export default function ModalAlert({show, onConfirm, onCancel, variant, title, msg}) {
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
                onClick={onConfirm}
        >
          <Typography variant="button">
            Aceptar
          </Typography>
        </Button>
        {
          onCancel &&
          <Button variant="black"
                  block
                  onClick={onCancel}
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