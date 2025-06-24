import TextField from "@mui/material/TextField";

const NewInput = ({label , aoMudar, valor}) => {
    return(
        <TextField value={valor} label={label} onChange={aoMudar} variant="outlined"></TextField>
    )
}


export default NewInput