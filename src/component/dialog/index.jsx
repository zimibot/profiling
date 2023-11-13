import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@suid/material";
import { useAppState } from "../../helper/_helper.context";
import { mode } from "../../helper/_helper.theme";

export default function AlertDialog({ title = "INFORMATION", description, name = "open", handleClick }) {
    const [appStore, { update }] = useAppState();



    const handleOpen = () => {
        handleClick()
    };

    const handleClose = () => {
        update(d => ({ ...d, [name]: false }));
    };



    return (
        <Dialog
            open={appStore()[name]}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                '.MuiPaper-root': {
                    bgcolor: mode() === "dark" ? "#171717" : "#eee",
                    color: mode() === "dark" ? "#ccc" : "#444"
                }
            }}
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" class="">
                    <span className={mode() === "dark" ? "text-white" : "#000"}>{description}</span>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={handleClose}>Cancel</Button>
                <Button color="info" onClick={handleOpen}>Agree</Button>
            </DialogActions>
        </Dialog>
    );
}
