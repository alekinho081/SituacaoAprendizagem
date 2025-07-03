import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const NewCard = ({sx, children, ...other }) => {
    return (
        <Card sx={{ ...sx }} {...other} variant='outlined'>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};

export default NewCard;
