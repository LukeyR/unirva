import React from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./firebase";
import {Link} from "react-router-dom";
import {Box, Card, CardActionArea, CardContent, CardMedia, Divider, makeStyles, Typography} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        width: "300px",
    },
})

function HomeListingCard(props) {

    const {name, price, imgUrl, seller, description} = props.listingObj
    const classes = useStyles();

    return (
        <Link to={{
            pathname:"/DisplayProduct",
            state:[{iD: props.iD}]
        }}
              style={{textDecoration: "none"}}>
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        alt="Contemplative Reptile"
                        height="200"
                        image={imgUrl}
                        title="Contemplative Reptile"
                    />
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography gutterBottom variant="h5" component="h4" display="inline" noWrap>
                                {name}
                            </Typography>
                            <Typography gutterBottom variant="subtitle1" component="h3" display="inline" align="right">
                                £{price}
                            </Typography>
                        </Box>
                        <Divider variant="middle"/>
                        <Typography variant="body2" color="textSecondary" component="p" noWrap>
                            {description}
                        </Typography>
                    </CardContent>

                </CardActionArea>
            </Card>
        </Link>
    )
}

export default HomeListingCard;