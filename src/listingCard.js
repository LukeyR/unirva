import React, {useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./firebase";
import {Link, useHistory} from "react-router-dom";
import {
    Box, Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Divider, Grow,
    Icon, IconButton,
    makeStyles, Tooltip,
    Typography, Zoom
} from "@material-ui/core";
import {Edit, Favorite, FavoriteBorder, FavoriteBorderOutlined, Chat} from "@material-ui/icons";
import {red} from "@material-ui/core/colors";
import firebase from "./firebase";
import {useDocumentData} from "react-firebase-hooks/firestore";

const useStyles = makeStyles({
    root: {
        width: "300px",
    },
    icons: {
        display: "flex",
        justifyContent: "flex-end",
    },
})

const firestore = firebase.firestore();

function HomeListingCard(props) {

    const {name, price, imgUrl, seller, description, likedBy} = props.listingObj
    const classes = useStyles();
    const history = useHistory();
    const [user] = useAuthState(auth);

    const [liked, setLiked] = useState(likedBy.includes(user.uid))

    const [sellerDoc, loadingUserDoc] = useDocumentData(firestore.collection("users").doc(seller))


    const likeItem = () => {
        if (liked) {
            unlikeItem();
            return;
        }
        if (user) firestore.collection("listings").doc(props.iD).update({
            likedBy: firebase.firestore.FieldValue.arrayUnion(user.uid),
        })
        setLiked(true)
    }

    const unlikeItem = () => {
        if (user) firestore.collection("listings").doc(props.iD).update({
            likedBy: firebase.firestore.FieldValue.arrayRemove(user.uid),
        })
        setLiked(false)
    }

    return (
        // <Link to={{
        //     pathname:"/DisplayProduct",
        //     state:[{iD: props.iD}]
        // }}
        //       style={{textDecoration: "none"}}>
            <Card className={classes.root}>
                <CardActionArea onClick={() => {history.push({pathname: "/DisplayProduct", state: {iD: props.iD}})}}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={imgUrl}
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
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="textSecondary" component="p" noWrap style={{marginTop: "10px"}}>
                                {description !== "" ? description : "No description provided..."}
                            </Typography>
                        </Box>
                    </CardContent>

                </CardActionArea>
                <div className={classes.icons}>
                <Tooltip title={seller === user.uid ? "Edit your listing" : "Message seller"} >
                    <IconButton onClick={() => {(user && seller === user.uid) ?
                        history.push({
                            pathname: "/EditProduct",
                            state: {
                                iDListing: props.iD,
                                name: name,
                                description: description,
                                price: price,
                                url: imgUrl,
                            },
                        })
                        : (user) ?
                    (history.push({
                        pathname: "/ChatRoom",
                        state: {
                            targetUserID: seller,
                            targetUserName:  sellerDoc.Name,
                            myUID: user.uid
                        },
                    }))
                            :
                            history.push("/menu")
                    }}>
                        {seller === user.uid ? <Edit /> : <Chat />}
                    </IconButton>
                </Tooltip>
                <Tooltip title={liked ? "Remove from favourites" : "Add to favourites"}>
                    <IconButton onClick={() => {likeItem()}}>
                        {likedBy.includes(user.uid) ? <Grow in={liked} ><Favorite color="error" /></Grow> : <FavoriteBorder />}
                    </IconButton>
                </Tooltip>
                    </div>
            </Card>
        // </Link>
    )
}

export default HomeListingCard;