import {createDocument} from "tripledoc";
import {rdf, rdfs} from "rdf-namespaces";
import * as ags from "../owl";
import {checkOwnerAuthDocument} from "./checkOwnerAuthDocument";
import {getDocument} from "./getDocument";

export const saveFarmData = async (webId, farmName, farmSurface, farmPlots) => {
  let farmIdentifier = farmName.toLowerCase().replace(" ", "");
  let plotsDocumentsRef = [];

  let webIdRoot = `${webId.split("/profile/card#me")[0]}`;
  let agroSolidDocumentUri = `${webIdRoot}/agrosolid`;

  console.log("getDocument(agroSolidDocumentUri)")
  const agroSolidDocument = await getDocument(agroSolidDocumentUri);
  if (agroSolidDocument) {
    console.log("hay agroSolidDocument")
    for (const plot of farmPlots) {
      let plotName = plot.name.toLowerCase().replace(" ", "");
      let plotIdentifier = `plot${plotName}from${farmIdentifier}`;
      let plotDocument = createDocument(`${webIdRoot}/${plotIdentifier}`);
      let plotSubject = plotDocument.addSubject({identifier: plotIdentifier});
      plotSubject.setRef(rdf.type, ags.Plot);
      plotSubject.setString(ags.name, plot.name);
      plotSubject.setDecimal(ags.surface, parseFloat(plot.surface));
      console.log("plotDocument.save()")
      let persistedPlotDocument = await plotDocument.save();
      checkOwnerAuthDocument(persistedPlotDocument, webId);
      plotsDocumentsRef.push(persistedPlotDocument.asRef());
    }

    let farmDocument = createDocument(`${webIdRoot}/${farmIdentifier}`);
    let farmSubject = farmDocument.addSubject({identifier: farmIdentifier});
    farmSubject.setRef(rdf.type, ags.Farm);
    farmSubject.setString(ags.name, farmName);
    farmSubject.setDecimal(ags.surface, parseFloat(farmSurface));
    farmSubject.setRef(ags.hasOwner, webId);
    plotsDocumentsRef.forEach(
      (plotDocumentRef) => {
        farmSubject.setRef(ags.hasPlot, plotDocumentRef);
      }
    );
    console.log("farmDocument.save()")
    let persistedFarmDocument = await farmDocument.save();
    checkOwnerAuthDocument(persistedFarmDocument, webId);

    let agroSolidFarmSubject = agroSolidDocument.addSubject();
    agroSolidFarmSubject.setRef(rdfs.isDefinedBy, persistedFarmDocument.asRef());
    console.log("agroSolidDocument.save()")
    await agroSolidDocument.save();
  }
  console.log("finish")
};