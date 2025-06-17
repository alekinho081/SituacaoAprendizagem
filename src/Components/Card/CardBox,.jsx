import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const newCard = ({ name, desc }) => {
    return (
        <Card>
            <CardContent>
                <Typography>{name}</Typography>
                <Typography>{desc}</Typography>
            </CardContent>
            <CardActions>
                <Button></Button>
            </CardActions>
        </Card>
    )
}


export default newCard()