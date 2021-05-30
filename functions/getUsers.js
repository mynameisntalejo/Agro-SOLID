import {rdfs} from "rdf-namespaces";
import {getDocument} from "./getDocument";
import {getProfileData} from "./getProfileData";

export const getUsers = async () => {
  let users = [];
  let usersDocument = await getDocument("https://agrosolid.inrupt.net/usersWebId.ttl");
  if (usersDocument) {
    for (const user of usersDocument ? usersDocument.findSubjects(rdfs.isDefinedBy, "") : []) {
      let [profileWebId, profileFirstName, profileLastName] = await getProfileData(user.getRef(rdfs.isDefinedBy));
      users.push({
        webId: profileWebId,
        firstName: profileFirstName,
        lastName: profileLastName
      });
    }
  }
  return users.sort((a, b) => {
    return (a.firstName + a.lastName) > (b.firstName + b.lastName) ? 1 : -1
  });
};