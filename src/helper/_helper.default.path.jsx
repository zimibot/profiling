import { useLocation } from "@solidjs/router";

export const defaultPathRedirect = {
    login: "/deck-explorer",
    currentHref: () => useLocation().pathname
}
