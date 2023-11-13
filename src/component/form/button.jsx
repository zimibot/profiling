
import { Button, CircularProgress } from "@suid/material";
import { mode } from "../../helper/_helper.theme";
export const ButtonForm = ({ teks, loading, disabled, h, w, p = 1, ...props }) => {
  return <Button
  type="submit"
  {...props}
  disabled={disabled && disabled()}
    sx={{
      borderRadius: 0,
      fontSize: 12,
      height: h,
      width: w,
      padding: p,
      "&.MuiButtonBase-root:hover": mode() === "dark" ? {
        bgcolor: "white",
        color: "black"
      } : {
        bgcolor: "#222",
        color: "white"
      }
    }} color="secondary" variant="contained">
      
    {loading && loading() ? <CircularProgress size={20}></CircularProgress>: teks}
  </Button>
}