import {createDocument} from "tripledoc";
import {acl, foaf, rdf} from "rdf-namespaces";
import {getDocument} from "./getDocument";

export const checkOwnerAuthDocument = async (document, webId) => {
  let documentAclRefUri = document.getAclRef();
  let documentAclRef = await getDocument(documentAclRefUri);
  if (!documentAclRef) {
    let newAcl = createDocument(documentAclRefUri);
    let ownerAuth = newAcl.addSubject({identifier: "owner"});
    ownerAuth.setRef(rdf.type, acl.Authorization);
    ownerAuth.setRef(acl.accessTo, document.asRef());
    ownerAuth.setRef(acl.agent, webId);
    ownerAuth.setRef(acl.mode, acl.Control);
    ownerAuth.setRef(acl.mode, acl.Read);
    ownerAuth.setRef(acl.mode, acl.Write);
    let subjectRead = newAcl.addSubject({identifier: "Read"});
    subjectRead.setRef(rdf.type, acl.Authorization);
    subjectRead.setRef(acl.accessTo, document.asRef());
    subjectRead.setRef(acl.agentClass, foaf.Agent);
    subjectRead.setRef(acl.mode, acl.Read);
    await newAcl.save();
  }
};