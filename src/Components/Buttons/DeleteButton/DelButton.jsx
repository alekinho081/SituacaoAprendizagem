import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteButton = ({ onClick }) => {
    return (
        <Button variant='outlined' onClick={onClick} startIcon={<DeleteIcon />}>
            Delete
        </Button>
    )
}

export default DeleteButton