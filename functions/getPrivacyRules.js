import {acl} from "rdf-namespaces";
import {getDocument} from "./getDocument";

export const getPrivacyRules = async (webId, farm, farmPlots) => {
  let webIdRoot = `${webId.split("/profile/card#me")[0]}`;
  let privacyRules = {};
  let farmDocument = await getDocument(`${webIdRoot}${farm.documentUri}`);
  let farmDocumentAclRefUri = farmDocument.getAclRef();
  let farmDocumentAcl = await getDocument(farmDocumentAclRefUri);
  let farmPrivacyRules = ["Ninguno"];
  for (const subject of farmDocumentAcl ? farmDocumentAcl.findSubjects(acl.mode, acl.Read) : []) {
    if (subject.getAllRefs(acl.mode).length === 1) {
      let farmPrivacyUsers = subject.getAllRefs(acl.agent);
      if (farmPrivacyUsers.length) {
        if (!farmPrivacyUsers.includes(webId)) {
          farmPrivacyRules = farmPrivacyUsers;
        }
      } else {
        farmPrivacyRules = ["Todos"];
      }
    }
    privacyRules[farm.documentUri] = farmPrivacyRules;
  }
  for (const plot of farmPlots) {
    let plotDocument = await getDocument(`${webIdRoot}${plot.documentUri}`);
    let plotDocumentAclRefUri = plotDocument.getAclRef();
    let plotDocumentAcl = await getDocument(plotDocumentAclRefUri);
    let plotPrivacyRules = ["Ninguno"];
    for (const subject of plotDocumentAcl ? plotDocumentAcl.findSubjects(acl.mode, acl.Read) : []) {
      if (subject.getAllRefs(acl.mode).length === 1) {
        let plotPrivacyUsers = subject.getAllRefs(acl.agent);
        if (plotPrivacyUsers.length) {
          if (!plotPrivacyUsers.includes(webId)) {
            plotPrivacyRules = plotPrivacyUsers;
          }
        } else {
          plotPrivacyRules = ["Todos"];
        }
      }
      privacyRules[plot.documentUri] = plotPrivacyRules;
    }
  }
  return privacyRules;
};