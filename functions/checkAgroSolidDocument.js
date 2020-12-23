import {createDocument} from "tripledoc";
import {getDocument} from "./getDocument";
import {initializeAgroSolidDocument} from "./initializeAgroSolidDocument";

export const checkAgroSolidDocument = (webId) => {
  let documentUri = `${webId.split(".net/")[0]}.net/prueba1`;
  getDocument(documentUri).then(
    async (document) => {
      if (!document) {
        const document = createDocument(documentUri);
        await document.save();
        initializeAgroSolidDocument(documentUri);
      }
    }
  )
};
