import {rdfs} from "rdf-namespaces";
import {getDocument} from "./getDocument";

export const saveUser = async (webId) => {
  let usersDocument = await getDocument("https://agrosolid.inrupt.net/usersWebId.ttl");
  if (usersDocument) {
    let exists = false;
    for (const user of usersDocument ? usersDocument.findSubjects(rdfs.isDefinedBy, webId) : []) {
      exists = true;
    }
    if (!exists) {
      let userSubject = usersDocument.addSubject();
      userSubject.setRef(rdfs.isDefinedBy, webId);
      await usersDocument.save();
    }
  }
};