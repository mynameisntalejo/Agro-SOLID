import {rdf} from "rdf-namespaces";
import * as ags from "../owl";
import {getDocument} from "./getDocument";

export const getFarmData = async (webId, farmUri) => {
  let farmData;
  let webIdRoot = `${webId.split("/profile/card#me")[0]}`;
  let farmDocumentUri = `${webIdRoot}/${farmUri}`;
  let farmDocument = await getDocument(farmDocumentUri);
  for (const farm of farmDocument.findSubjects(rdf.type, ags.Farm)) {
    let farmName = farm.getString(ags.name);
    let farmSurface = farm.getInteger(ags.surface);
    farmData = {
      documentUri: farmDocumentUri.split(webIdRoot)[1],
      name: farmName,
      surface: farmSurface,
      plots: []
    }
    for (const plotDocumentUri of farm.getAllRefs(ags.hasPlot)) {
      let plotDocument = await getDocument(plotDocumentUri);
      for (const plot of plotDocument.findSubjects(rdf.type, ags.Plot)) {
        let plotName = plot.getString(ags.name);
        let plotSurface = plot.getInteger(ags.surface);
        let plotData = {
          documentUri: plotDocumentUri.split(webIdRoot)[1],
          name: plotName,
          surface: plotSurface,
        }
        farmData.plots.push(plotData);
      }
    }
  }
  return farmData;
}