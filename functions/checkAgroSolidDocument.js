import {createDocument} from "tripledoc";
import {checkOwnerAuthDocument} from "./checkOwnerAuthDocument";
import {getDocument} from "./getDocument";

export const checkAgroSolidDocument = async (webId) => {
  let webIdRoot = `${webId.split("/profile/card#me")[0]}`
  let documentUri = `${webIdRoot}/agrosolid`;
  getDocument(documentUri).then(
    async (document) => {
      let agroSolidDocument = document;
      if (!agroSolidDocument) {
        const localDocument = createDocument(documentUri);
        agroSolidDocument = await localDocument.save();
      }
      checkOwnerAuthDocument(agroSolidDocument, webId);
    }
  );

/*
Se utiliza el agrosolid.owl alojado en agrosolid.inrupt.net
Se deja el código por si cambia la lógica del sistema y se llega a necesitar

  let agroSolidOwlUri = `${webIdRoot}/agrosolid.owl`;
  await initializeAgroSolidOwl(agroSolidOwlUri, webId);
*/
};
