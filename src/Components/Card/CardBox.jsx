import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const NewCard = ({ css, children }) => {
    return (
        <Card sx={css}>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};

export default NewCard;
