import SolidAuthClient from "solid-auth-client";
import {rdf, rdfs} from "rdf-namespaces";
import * as ags from "../owl";
import {getDocument} from "./getDocument";

export const deleteFarmData = async (webId, farmUri) => {
  let webIdRoot = `${webId.split("/profile/card#me")[0]}`;
  let agroSolidDocumentUri = `${webIdRoot}/agrosolid`;
  let farmDocumentUri = `${webIdRoot}/${farmUri}`;
  let farmDocument = await getDocument(farmDocumentUri);
  let farmDocumentRef = farmDocument.asRef();
  for (const farm of farmDocument.findSubjects(rdf.type, ags.Farm)) {
    for (const plotDocumentUri of farm.getAllRefs(ags.hasPlot)) {
      let plotDocument = await getDocument(plotDocumentUri);
      await SolidAuthClient.fetch(plotDocument.asRef(), {
        method: "DELETE"
      });
    }
  }
  await SolidAuthClient.fetch(farmDocumentRef, {
    method: "DELETE"
  });
  const agroSolidDocument = await getDocument(agroSolidDocumentUri);
  for (const farm of agroSolidDocument.findSubjects(rdfs.isDefinedBy, farmDocumentRef)) {
    agroSolidDocument.removeSubject(farm.asRef());
  }
  await agroSolidDocument.save();
}