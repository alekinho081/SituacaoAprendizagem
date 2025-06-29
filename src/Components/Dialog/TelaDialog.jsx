import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";


const TelaDialog = ({ abre ,dialogoTitulo, children, onClose }) => {
    return (
        <>
            <Dialog open={abre} onClose={onClose}>
                <DialogTitle>{dialogoTitulo}</DialogTitle>
                <DialogContent>
                {children}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default TelaDialog