import {rdf} from "rdf-namespaces";
import * as ags from "../owl";
import {getDocument} from "./getDocument";

export const getCrops = async () => {
  let crops = [];
  let cropsDocument = await getDocument("https://agrosolid.inrupt.net/crops.ttl");
  if (cropsDocument) {
    for (const crop of cropsDocument ? cropsDocument.findSubjects(rdf.type, ags.Crop) : []) {
      crops.push({
        documentUri: crop.asRef(),
        name: crop.getString(ags.name)
      });
    }
  }
  return crops.sort((a, b) => {
    return a.name > b.name ? 1 : -1
  });
};