import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';


const EditButton = ({ onClick }) => {
    return(
        <Button variant='contained' onClick={onClick} startIcon={<EditIcon/>}>
         Edit   
        </Button>
    )
}

export default EditButton