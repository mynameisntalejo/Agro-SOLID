import {rdf} from "rdf-namespaces";
import * as ags from "../owl";
import {getDocument} from "./getDocument";

export const createCrop = async (cropName) => {
  let cropsDocument = getDocument("https://agrosolid.inrupt.net/crops.ttl");
  if (cropsDocument) {
    const crop = document.addSubject({identifier: cropName});
    crop.setRef(rdf.type, ags.Crop);
    crop.setString(ags.name, cropName);
    await document.save();
  }
};