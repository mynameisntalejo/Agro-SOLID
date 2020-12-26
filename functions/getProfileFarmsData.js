import {getDocument} from "./getDocument";
import {rdfs, rdf} from "rdf-namespaces";
import * as ags from "../owl";
import {getProfileData} from "./getProfileData";

export const getProfileFarmsData = async (webId) => {
  let farms = [];
  let webIdRoot = `${webId.split("/profile/card#me")[0]}`
  let agroSolidDocumentUri = `${webIdRoot}/agrosolid`;
  let agroSolidDocument = await getDocument(agroSolidDocumentUri);
  for (const triple of agroSolidDocument.findSubjects(rdfs.isDefinedBy, "")) {
    let farmDocumentUri = triple.getRef(rdfs.isDefinedBy);
    let farmDocument = await getDocument(farmDocumentUri);
    for (const farm of farmDocument.findSubjects(rdf.type, ags.Farm)) {
      let [farmOwnerWebId, farmOwnerFirstName, farmOwnerLastName] = await getProfileData(farm.getRef(ags.hasOwner));
      let farmName = farm.getString(ags.name);
      let farmSurface = farm.getDecimal(ags.surface);
      let farmData = {
        documentUri: farmDocumentUri,
        name: farmName,
        surface: farmSurface,
        owner: {
          webId: farmOwnerWebId,
          firstName: farmOwnerFirstName,
          lastName: farmOwnerLastName,
        },
        plots: []
      }
      for (const plotDocumentUri of farm.getAllRefs(ags.hasPlot)) {
        let plotDocument = await getDocument(plotDocumentUri);
        for (const plot of plotDocument.findSubjects(rdf.type, ags.Plot)) {
          let plotName = plot.getString(ags.name);
          let plotSurface = plot.getDecimal(ags.surface);
          farmData.plots.push(
            {
              name: plotName,
              surface: plotSurface
            }
          );
        }
      }
      farms.push(farmData);
    }
  }
  return farms;
}