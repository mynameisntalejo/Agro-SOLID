import {createDocument} from "tripledoc";
import {getDocument} from "./getDocument";
import {checkOwnerAuthDocument} from "./checkOwnerAuthDocument";

export const checkAgroSolidDocument = async (webId) => {
  let webIdRoot = `${webId.split("/profile/card#me")[0]}`
  let documentUri = `${webIdRoot}/prueba6`;
  getDocument(documentUri).then(
    async (document) => {
      if (!document) {
        const document = createDocument(documentUri);
        await document.save();
      }
      getDocument(documentUri).then(
        (document) => {
          if (document) {
            checkOwnerAuthDocument(document, webId);
          }
        }
      );
    }
  );

/*
Se utiliza el agrosolid.owl alojado en agrosolid.inrupt.net
Se deja el código por si cambia la lógica del sistema y se llega a necesitar

  let agroSolidOwlUri = `${webIdRoot}/agrosolid.owl`;
  await initializeAgroSolidOwl(agroSolidOwlUri);
  getDocument(agroSolidOwlUri).then(
    (document) => {
      if (document) {
        checkOwnerAuthDocument(document, webId);
      }
    }
  );
*/
};
