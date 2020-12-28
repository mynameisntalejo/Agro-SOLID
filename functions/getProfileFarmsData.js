import {rdf, rdfs} from "rdf-namespaces";
import * as ags from "../owl";
import {getDocument} from "./getDocument";
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
        documentUri: farmDocumentUri.split(webIdRoot)[1],
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
          let plotData = {
            documentUri: plotDocumentUri.split(webIdRoot)[1],
            name: plotName,
            surface: plotSurface,
            events : []
          }
          for (const eventRef of plot.getAllRefs(ags.hasEvent)) {
            let event = plotDocument.getSubject(eventRef);
            let eventType = event.getRef(rdf.type).split("#")[1].replace("Sowing", "Siembra").replace("Harvesting", "Cosecha");
            let eventCrop = event.getRef(ags.hasCrop).split("#")[1];
            let eventQuantity = event.getInteger(ags.quantity);
            let eventTimestamp = (new Date(event.getInteger(ags.timestamp))).toLocaleString();
            let eventData = {
              type: eventType,
              crop: eventCrop,
              quantity: eventQuantity,
              timestamp: eventTimestamp
            }
            plotData.events.push(eventData);
          }
          farmData.plots.push(plotData);
        }
      }
      farms.push(farmData);
    }
  }
  return farms;
}