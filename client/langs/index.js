import en from "./en";
import fi from "./fi";

export default state => {
    console.log("Rendering with language ", state.language);
    switch (state.language) {
        case "fi": return fi;
        case "en": default: return en;
    }
};