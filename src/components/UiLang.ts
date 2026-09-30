import { createContext, useContext } from "react";

/**
 * The interface text (labels, header, footer) is English. On pages whose main
 * content is in another language, those parts are marked lang="en".
 */
export const UiLangContext = createContext<"en" | undefined>(undefined);

export const useUiLang = () => useContext(UiLangContext);
