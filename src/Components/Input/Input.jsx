import TextField from "@mui/material/TextField";

const Input = ({label , valor}) => {
    return(
        <TextField label={label} value={valor} variant="outlined"></TextField>
    )
}


export default Input()