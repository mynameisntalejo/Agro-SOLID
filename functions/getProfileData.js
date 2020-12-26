import {foaf} from "rdf-namespaces";
import {getDocument} from "./getDocument";

export const getProfileData = async (webId) => {
  let document = await getDocument(webId);
  let profileFirstName = "", profileLastName = "";
  let profile = document.getSubject(webId);
  let currentFirstName = profile.getString(foaf.firstName);
  if (currentFirstName) {
    profileFirstName = currentFirstName;
  }
  let currentLastName = profile.getString(foaf.lastName);
  if (currentLastName) {
    profileLastName = currentLastName;
  }
  return [webId, profileFirstName, profileLastName];
}