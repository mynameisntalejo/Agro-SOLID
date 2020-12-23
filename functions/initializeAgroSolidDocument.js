import {getDocument} from "./getDocument";
import {owl, rdf, rdfs} from "rdf-namespaces";

export const initializeAgroSolidDocument = (documentUri) => {
  getDocument(documentUri).then(
    async (document) => {
      const cropClass = document.addSubject({identifier: "Crop"});
      cropClass.setRef(rdf.type, owl.Class);
      const eventClass = document.addSubject({identifier: "Event"});
      eventClass.setRef(rdf.type, owl.Class);
      const farmClass = document.addSubject({identifier: "Farm"});
      farmClass.setRef(rdf.type, owl.Class);
      const harvestingClass = document.addSubject({identifier: "Harvesting"});
      harvestingClass.setRef(rdf.type, owl.Class);
      harvestingClass.setRef(rdfs.subClassOf, eventClass.asRef());
      await document.save();
    }
  )
};
