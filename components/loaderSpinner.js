import Spinner from "react-bootstrap/Spinner";

export default function LoaderSpinner({variant, size, srmsg}) {
  return (
    <Spinner animation="border"
             role="status"
             variant={variant}
             size={size}
    >
      <span className="sr-only">{srmsg}</span>
    </Spinner>
  )
}