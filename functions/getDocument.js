import {fetchDocument} from "tripledoc";

export const getDocument = async (url) => {
    if (url) {
        let document = await fetchDocument(url);
        if (document) {
            return document;
        }
    }
    return false;
};
