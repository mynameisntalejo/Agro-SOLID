import {createDocument} from "tripledoc";
import {acl, rdf} from "rdf-namespaces";
import {getDocument} from "./getDocument";

export const checkOwnerAuthDocument = async (document, webId) => {
  let documentAclRefUri = document.getAclRef();
  let documentAclRef = await getDocument(documentAclRefUri);
  if (!documentAclRef) {
    let newAcl = createDocument(documentAclRefUri);
    const ownerAuth = newAcl.addSubject();
    ownerAuth.setRef(rdf.type, acl.Authorization);
    ownerAuth.setRef(acl.accessTo, document.asRef());
    ownerAuth.setRef(acl.default__workaround, document.asRef());
    ownerAuth.setRef(acl.mode, acl.Read);
    ownerAuth.setRef(acl.mode, acl.Write);
    ownerAuth.setRef(acl.mode, acl.Append);
    ownerAuth.setRef(acl.mode, acl.Control);
    ownerAuth.setRef(acl.agent, webId);
    ownerAuth.setRef(acl.origin, "http://127.0.0.1:3000");
    ownerAuth.setRef(acl.origin, "http://localhost:3000");
    ownerAuth.setRef(acl.origin, "https://agro-solid.vercel.app");
    await newAcl.save();
  }
};