import {foaf} from "rdf-namespaces";

export const editProfileData = async (document, webId, firstName, lastName) => {
  if (document) {
    let profile = document.getSubject(webId);
    profile.removeAll(foaf.name);
    profile.removeAll(foaf.firstName);
    profile.removeAll(foaf.lastName);
    profile.addString(foaf.name, `${firstName} ${lastName}`);
    profile.addString(foaf.firstName, firstName);
    profile.addString(foaf.lastName, lastName);
    await document.save();
  }
}