import {foaf} from "rdf-namespaces";

export const editProfileData = async (document, webId, firstName, lastName) => {
  let profile = document.getSubject(webId);
  profile.setString(foaf.name, `${firstName} ${lastName}`);
  profile.setString(foaf.firstName, firstName);
  profile.setString(foaf.lastName, lastName);
  await document.save();
}