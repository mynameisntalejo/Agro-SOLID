import {acl, foaf, rdf} from "rdf-namespaces";
import {getDocument} from "./getDocument";

export const saveFarmPrivacyData = async (webId, farmPrivacyRules) => {
  let webIdRoot = `${webId.split("/profile/card#me")[0]}`;
  for (const keyUri of Object.keys(farmPrivacyRules)) {
    let documentUri = `${webIdRoot}${keyUri}`;
    let document = await getDocument(documentUri);
    let documentAclRefUri = document.getAclRef();
    let documentAcl = await getDocument(documentAclRefUri);
    if (documentAcl) {
      for (const authorization of documentAcl ? documentAcl.findSubjects(acl.mode, acl.Read) : []) {
        if (authorization.getAllRefs(acl.mode).length === 1) {
          documentAcl.removeSubject(authorization.asRef());
        }
      }
      let privacyRules = farmPrivacyRules[keyUri];
      let subjectAuth = documentAcl.addSubject({identifier: "Read"});
      subjectAuth.setRef(rdf.type, acl.Authorization);
      subjectAuth.setRef(acl.accessTo, document.asRef());
      subjectAuth.setRef(acl.mode, acl.Read);
      if (privacyRules.includes("Todos")) {
        subjectAuth.setRef(acl.agentClass, foaf.Agent);
      } else if (privacyRules.includes("Ninguno")) {
        subjectAuth.setRef(acl.agent, webId);
      } else {
        privacyRules.forEach(
          (whoWebId) => {
            subjectAuth.setRef(acl.agent, whoWebId);
          }
        );
      }
      await documentAcl.save();
    }
  }
};