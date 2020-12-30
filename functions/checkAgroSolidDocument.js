import {createDocument} from "tripledoc";
import {checkOwnerAuthDocument} from "./checkOwnerAuthDocument";
import {getDocument} from "./getDocument";

export const checkAgroSolidDocument = async (webId) => {
  let webIdRoot = `${webId.split("/profile/card#me")[0]}`;
  let agroSolidDocumentUri = `${webIdRoot}/agrosolid`;
  let agroSolidDocument = await getDocument(agroSolidDocumentUri);
  if (!agroSolidDocument) {
    const localDocument = createDocument(agroSolidDocumentUri);
    agroSolidDocument = await localDocument.save();
  }
  await checkOwnerAuthDocument(agroSolidDocument, webId);
};
