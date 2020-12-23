import {foaf} from "rdf-namespaces";

export const getProfileData = (document, webId) => {
  let profileFirstName = "", profileLastName = "";
  if (document) {
    let profile = document.getSubject(webId);
    let currentFirstName = profile.getString(foaf.firstName);
    if (currentFirstName) {
      profileFirstName = currentFirstName;
    }
    let currentLastName = profile.getString(foaf.lastName);
    if (currentLastName) {
      profileLastName = currentLastName;
    }
  }
  return [webId, profileFirstName, profileLastName];
}