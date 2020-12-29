import {createDocument} from "tripledoc";
import {rdf, rdfs} from "rdf-namespaces";
import * as ags from "../owl";
import {checkOwnerAuthDocument} from "./checkOwnerAuthDocument";
import {getDocument} from "./getDocument";
import SolidAuthClient from "solid-auth-client";

export const saveFarmData = async (webId, farmName, farmSurface, farmPlots, farmUri) => {
  let farmIdentifier = farmName.toLowerCase().replaceAll(" ", "");
  let addPlotsDocumentsRef = [], removePlotsDocumentsRef = [];

  let webIdRoot = `${webId.split("/profile/card#me")[0]}`;
  let agroSolidDocumentUri = `${webIdRoot}/agrosolid`;

  const agroSolidDocument = await getDocument(agroSolidDocumentUri);
  if (agroSolidDocument) {
    for (const plot of farmPlots) {
      let plotDocument, plotSubject;
      if (plot.documentUri) {
        plotDocument = await getDocument(`${webIdRoot}${plot.documentUri}`);
        for (const plotSubjectDocument of plotDocument.findSubjects(rdf.type, ags.Plot)) {
          plotSubject = plotSubjectDocument;
        }
      } else {
        let plotName = plot.name.toLowerCase().replaceAll(" ", "");
        let plotIdentifier = `plot${plotName}from${farmIdentifier}`;
        plotDocument = createDocument(`${webIdRoot}/${plotIdentifier}`);
        plotSubject = plotDocument.addSubject({identifier: plotIdentifier});
        plotSubject.setRef(rdf.type, ags.Plot);
      }
      if (plot.remove) {
        await SolidAuthClient.fetch(plotDocument.asRef(), {
          method: "DELETE"
        });
        removePlotsDocumentsRef.push(plotDocument.asRef());
      } else {
        plotSubject.setString(ags.name, plot.name);
        plotSubject.setInteger(ags.surface, parseInt(plot.surface));
        let persistedPlotDocument = await plotDocument.save();
        await checkOwnerAuthDocument(persistedPlotDocument, webId);
        addPlotsDocumentsRef.push(persistedPlotDocument.asRef());
      }
    }

    let farmDocument, farmSubject;
    if (farmUri) {
      farmDocument = await getDocument(`${webIdRoot}/${farmUri}`);
      for (const farmSubjectDocument of farmDocument.findSubjects(rdf.type, ags.Farm)) {
        farmSubject = farmSubjectDocument;
      }
    } else {
      farmDocument = createDocument(`${webIdRoot}/${farmIdentifier}`);
      farmSubject = farmDocument.addSubject({identifier: farmIdentifier});
      farmSubject.setRef(rdf.type, ags.Farm);
      farmSubject.setRef(ags.hasOwner, webId);
    }
    farmSubject.setString(ags.name, farmName);
    farmSubject.setInteger(ags.surface, parseFloat(farmSurface));
    removePlotsDocumentsRef.forEach(
      (plotDocumentRef) => {
        farmSubject.removeRef(ags.hasPlot, plotDocumentRef);
      }
    );
    addPlotsDocumentsRef.forEach(
      (plotDocumentRef) => {
        farmSubject.addRef(ags.hasPlot, plotDocumentRef);
      }
    );
    let persistedFarmDocument = await farmDocument.save();
    await checkOwnerAuthDocument(persistedFarmDocument, webId);

    if (!farmUri) {
      let agroSolidFarmSubject = agroSolidDocument.addSubject();
      agroSolidFarmSubject.setRef(rdfs.isDefinedBy, persistedFarmDocument.asRef());
      await agroSolidDocument.save();
    }
  }
};