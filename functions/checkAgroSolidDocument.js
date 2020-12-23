import {createDocument} from "tripledoc";
import {getDocument} from "./getDocument";

export const checkAgroSolidDocument = async (webId) => {
  let documentUri = `${webId.split(".net/")[0]}.net/agrosolid`;
  getDocument(documentUri).then(
    async (document) => {
      if (!document) {
        const document = createDocument(documentUri);
        await document.save();
      }
    }
  )
};
