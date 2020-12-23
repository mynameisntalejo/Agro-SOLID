import {fetchDocument} from "tripledoc";

export const getDocument = async (uri) => {
  if (uri) {
    try {
      return await fetchDocument(uri);
    } catch (error) {
      return false;
    }
  }
};
