import { Typography } from "@suid/material"
import { mode } from "../../helper/_helper.theme"

export const TypographyItems = ({children}) => {
    return <Typography color={mode() === "dark" ? "#eee" : "#444"}>{children}</Typography>
}