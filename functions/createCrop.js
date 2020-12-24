import {getDocument} from "./getDocument";
import {owl} from "rdf-namespaces";
import * as ags from "../owl";

export const createCrop = async (cropName) => {
  getDocument("https://agrosolid.inrupt.net/crops.ttl").then(
    async (document) => {
      if (document) {
        const crop = document.addSubject({identifier: cropName});
        crop.setRef(owl.Class, ags.Crop);
        crop.setString(ags.name, cropName);
        await document.save();
      }
    }
  );
};