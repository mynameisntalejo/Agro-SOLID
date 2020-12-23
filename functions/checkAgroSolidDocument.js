import {createDocument} from "tripledoc";
import {getDocument} from "./getDocument";
import {initializeAgroSolidOwl} from "./initializeAgroSolidOwl";

export const checkAgroSolidDocument = (webId) => {
  let webIdRoot = `${webId.split(".net/")[0]}.net/`
  let documentUri = `${webIdRoot}agrosolid`;
  getDocument(documentUri).then(
    async (document) => {
      if (!document) {
        const document = createDocument(documentUri);
        await document.save();
        await initializeAgroSolidOwl(`${webIdRoot}agrosolid.owl`);
      }
    }
  )
};
