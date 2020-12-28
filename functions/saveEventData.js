import {rdf} from "rdf-namespaces";
import * as ags from "../owl";
import {getDocument} from "./getDocument";

export const saveEventData = async (webId, plotUri, eventType, cropRef, eventQuantity, eventTimestamp) => {
  let webIdRoot = `${webId.split("/profile/card#me")[0]}`;
  let plotDocumentUri = `${webIdRoot}/${plotUri}`;

  const plotDocument = await getDocument(plotDocumentUri);
  if (plotDocument) {
    let eventSubject = plotDocument.addSubject();
    let eventTypeRef;
    if (eventType === "Siembra") {
      eventTypeRef = ags.Sowing;
    } else if (eventType === "Cosecha") {
      eventTypeRef = ags.Harvesting;
    }
    eventSubject.setRef(rdf.type, eventTypeRef)
    eventSubject.setInteger(ags.quantity, parseInt(eventQuantity));
    let eventDatetime = new Date(`${eventTimestamp.date} ${eventTimestamp.time}`);
    eventSubject.setInteger(ags.timestamp, eventDatetime.getTime());
    eventSubject.setRef(ags.hasCrop, cropRef);

    for (const plot of plotDocument.findSubjects(rdf.type, ags.Plot)) {
      plot.addRef(ags.hasEvent, eventSubject.asRef());
    }
    await plotDocument.save();
  }
};