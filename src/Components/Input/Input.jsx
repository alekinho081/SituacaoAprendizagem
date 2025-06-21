import TextField from "@mui/material/TextField";

const newInput = ({label , aoMudar}) => {
    return(
        <TextField label={label} onChange={aoMudar} variant="outlined"></TextField>
    )
}


export default newInput