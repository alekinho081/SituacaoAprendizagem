import TextField from "@mui/material/TextField";

const NewInput = ({label , aoMudar, valor, required, tipo}) => {
    return(
        <TextField type={tipo} value={valor} label={label} onChange={aoMudar} required={required} variant="outlined"></TextField>
    )
}


export default NewInput