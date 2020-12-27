import {useState} from "react";
import {useRouter} from "next/router"
import auth from "solid-auth-client";
import Link from "next/link"
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Typography from "@material-ui/core/Typography";
import LoaderSpinner from "./loaderSpinner";

export default function NavigationBar({setSession}) {
  const [loadingLogout, setLoadingLogout] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setLoadingLogout(true);
    setSession(false);
    await auth.logout();
    router.push("/login");
  }

  return (
    <Navbar bg="dark"
            variant="dark"
            expand="lg"
    >
      <Link href="/">
        <Navbar.Brand className="btn">
          <img alt="Agro-SOLID Logo"
               src="/static/images/agro-solid-logo.png"
               width="50"
               height="50"
               className="d-inline-block mr-2"
          />
          <Typography gutterBottom
                      variant="h4"
                      className="font-weight-bold"
          >
            Agro-SOLID
          </Typography>
        </Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="navigationBar"/>
      <Navbar.Collapse id="navigationBar">
        <Nav justify
             variant="pills"
             className="w-100"
        >
          <Nav.Link href="/"
                    className={(router.pathname === "/") ? "active active-page" : ""}
          >
            <Typography variant="button">
              Inicio
            </Typography>
          </Nav.Link>
          <Nav.Link href="/profile"
                    className={(router.pathname === "/profile") ? "active active-page" : ""}
          >
            <Typography variant="button">
              Mis datos
            </Typography>
          </Nav.Link>
          <Nav.Link href="#"
                    disabled={loadingLogout}
                    onClick={logout}
          >
            {
              !loadingLogout &&
              <Typography variant="button">
                Salir
              </Typography>
            }
            {
              loadingLogout &&
              <LoaderSpinner variant="light"
                             size="sm"
                             srmsg="Saliendo"
              />
            }
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}