import {rdf} from "rdf-namespaces";
import * as ags from "../owl";
import {getDocument} from "./getDocument";

export const createCrop = async (cropName) => {
  let cropsDocument = await getDocument("https://agrosolid.inrupt.net/crops.ttl");
  if (cropsDocument) {
    const crop = cropsDocument.addSubject({identifier: cropName});
    crop.setRef(rdf.type, ags.Crop);
    crop.setString(ags.name, cropName);
    await cropsDocument.save();
    return crop.asRef();
  }
};