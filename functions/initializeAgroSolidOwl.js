import {foaf, owl, rdf, rdfs} from "rdf-namespaces";
import {createDocument} from "tripledoc";

export const initializeAgroSolidOwl = async (documentUri) => {
  const document = createDocument(documentUri);

  /* Classes */
  // http://www.semanticweb.org/alejandrofernandez/ontologies/2020/9/untitled-ontology-17#Crop
  const cropClass = document.addSubject({identifier: "Crop"});
  cropClass.setRef(rdf.type, owl.Class);
  // http://www.semanticweb.org/alejandrofernandez/ontologies/2020/9/untitled-ontology-17#Event
  const eventClass = document.addSubject({identifier: "Event"});
  eventClass.setRef(rdf.type, owl.Class);
  // http://www.semanticweb.org/alejandrofernandez/ontologies/2020/9/untitled-ontology-17#Farm
  const farmClass = document.addSubject({identifier: "Farm"});
  farmClass.setRef(rdf.type, owl.Class);
  // http://www.semanticweb.org/alejandrofernandez/ontologies/2020/9/untitled-ontology-17#Harvesting
  const harvestingClass = document.addSubject({identifier: "Harvesting"});
  harvestingClass.setRef(rdf.type, owl.Class);
  harvestingClass.setRef(rdfs.subClassOf, eventClass.asRef());
  // http://www.semanticweb.org/alejandrofernandez/ontologies/2020/9/untitled-ontology-17#Plot
  const plotClass = document.addSubject({identifier: "Plot"});
  plotClass.setRef(rdf.type, owl.Class);
  // http://www.semanticweb.org/alejandrofernandez/ontologies/2020/9/untitled-ontology-17#Sowing
  const sowingClass = document.addSubject({identifier: "Sowing"});
  sowingClass.setRef(rdf.type, owl.Class);
  sowingClass.setRef(rdfs.subClassOf, eventClass.asRef());

  /* Data properties */
  // http://www.semanticweb.org/alejandrofernandez/ontologies/2020/9/untitled-ontology-17#name
  const nameProperty = document.addSubject({identifier: "name"});
  nameProperty.setRef(rdf.type, owl.DatatypeProperty);
  nameProperty.setRef(rdfs.domain, cropClass.asRef());
  nameProperty.setRef(rdfs.domain, farmClass.asRef());
  nameProperty.setRef(rdfs.domain, plotClass.asRef());
  nameProperty.setRef(rdfs.range, "http://www.w3.org/2001/XMLSchema#string");
  // http://www.semanticweb.org/alejandrofernandez/ontologies/2020/9/untitled-ontology-17#quantity
  const quantityProperty = document.addSubject({identifier: "quantity"});
  quantityProperty.setRef(rdf.type, owl.DatatypeProperty);
  quantityProperty.setRef(rdfs.domain, harvestingClass.asRef());
  quantityProperty.setRef(rdfs.domain, sowingClass.asRef());
  quantityProperty.setRef(rdfs.range, "http://www.w3.org/2001/XMLSchema#double");
  // http://www.semanticweb.org/alejandrofernandez/ontologies/2020/9/untitled-ontology-17#surface
  const surfaceProperty = document.addSubject({identifier: "surface"});
  surfaceProperty.setRef(rdf.type, owl.DatatypeProperty);
  surfaceProperty.setRef(rdfs.subPropertyOf, owl.topDataProperty);
  // http://www.semanticweb.org/alejandrofernandez/ontologies/2020/9/untitled-ontology-17#timestamp
  const timestampProperty = document.addSubject({identifier: "timestamp"});
  timestampProperty.setRef(rdf.type, owl.DatatypeProperty);
  timestampProperty.setRef(rdfs.domain, eventClass.asRef());
  timestampProperty.setRef(rdfs.range, "http://www.w3.org/2001/XMLSchema#dateTimeStamp");

  /* Object Properties */
  // http://www.semanticweb.org/alejandrofernandez/ontologies/2020/9/untitled-ontology-17#hasCrop
  const hasCropProperty = document.addSubject({identifier: "hasCrop"});
  hasCropProperty.setRef(rdf.type, owl.ObjectProperty);
  hasCropProperty.setRef(rdfs.domain, eventClass.asRef());
  hasCropProperty.setRef(rdfs.range, cropClass.asRef());
  // http://www.semanticweb.org/alejandrofernandez/ontologies/2020/9/untitled-ontology-17#hasEvent
  const hasEventProperty = document.addSubject({identifier: "hasEvent"});
  hasEventProperty.setRef(rdf.type, owl.ObjectProperty);
  hasEventProperty.setRef(rdfs.domain, plotClass.asRef());
  hasEventProperty.setRef(rdfs.range, eventClass.asRef());
  // http://www.semanticweb.org/alejandrofernandez/ontologies/2020/9/untitled-ontology-17#hasOwner
  const hasOwnerProperty = document.addSubject({identifier: "hasOwner"});
  hasOwnerProperty.setRef(rdf.type, owl.ObjectProperty);
  hasOwnerProperty.setRef(rdfs.domain, farmClass.asRef());
  hasOwnerProperty.setRef(rdfs.range, foaf.Person);
  // http://www.semanticweb.org/alejandrofernandez/ontologies/2020/9/untitled-ontology-17#hasPlot
  const hasPlotProperty = document.addSubject({identifier: "hasPlot"});
  hasPlotProperty.setRef(rdf.type, owl.ObjectProperty);
  hasPlotProperty.setRef(rdfs.subPropertyOf, owl.topObjectProperty);
  hasPlotProperty.setRef(rdfs.domain, farmClass.asRef());
  hasPlotProperty.setRef(rdfs.range, plotClass.asRef());

  await document.save();
};
