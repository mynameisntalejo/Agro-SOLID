import {createDocument} from "tripledoc";
import {getDocument} from "./getDocument";
import {initializeAgroSolidOwl} from "./initializeAgroSolidOwl";
import {checkOwnerAuthDocument} from "./checkOwnerAuthDocument";

export const checkAgroSolidDocument = async (webId) => {
  let webIdRoot = `${webId.split("/profile/card#me")[0]}`
  let documentUri = `${webIdRoot}/agrosolid`;
  getDocument(documentUri).then(
    async (document) => {
      if (!document) {
        const document = createDocument(documentUri);
        await document.save();
      }
    }
  );
  getDocument(documentUri).then(
    (document) => {
      if (document) {
        checkOwnerAuthDocument(document, webId);
      }
    }
  );
  let agroSolidOwlUri = `${webIdRoot}/agrosolid.owl`;
  await initializeAgroSolidOwl(agroSolidOwlUri);
  getDocument(agroSolidOwlUri).then(
    (document) => {
      if (document) {
        checkOwnerAuthDocument(document, webId);
      }
    }
  )
};
