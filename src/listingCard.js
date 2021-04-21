import React from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import firebase, {auth} from "./firebase";
import {useHistory} from "react-router-dom";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Divider,
    Grow,
    IconButton,
    makeStyles,
    Tooltip,
    Typography
} from "@material-ui/core";
import {Chat, Edit, Favorite, FavoriteBorder} from "@material-ui/icons";
import {useDocumentData} from "react-firebase-hooks/firestore";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "300px",
    },
    icons: {
    },
    soldText: {
        color: (theme.mode === "dark" ? "white" : "black"),
        position: "absolute",
        top: "30%",
        left: "50%",
        webkitTransform: "translate(-50%, -50%)",
        // textStroke: "1px white",
        msTransform: "translate(-50%, -50%)",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        opacity: 1,
    },
    soldOverlay: {
        borderRadius: "4px", position: "absolute",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        height: "100%",
        width: "100%",
        transition: ".5s ease",
        backgroundColor: (theme.mode === "dark" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)"),
    }
}))

const firestore = firebase.firestore();

//2.26
//3.1+

function HomeListingCard(props) {
    const {name, price, imgUrl, seller, description, likedBy, allPhotos, categories, createdAt, sold} = props.listingObj
    const classes = useStyles();
    const history = useHistory();
    const [user] = useAuthState(auth);

    const date2 = new Date()
    const diffTime = Math.abs((date2.getTime() / 1000) - createdAt.seconds);
    const diffDays = Math.floor(diffTime / (60 * 60 * 24));


    const [sellerDoc, loadingSellerDoc] = useDocumentData(firestore.collection("users").doc(seller))

    let liked = null;
    if (user) liked = likedBy.includes(user.uid)


    const likeItem = () => {
        if (liked) {
            unlikeItem();
            return;
        }
        if (user) {
            firestore.collection("listings").doc(props.iD).update({
                likedBy: firebase.firestore.FieldValue.arrayUnion(user.uid),
            })
        }
        liked = true
    }

    const unlikeItem = () => {
        if (user) {
            firestore.collection("listings").doc(props.iD).update({
                likedBy: firebase.firestore.FieldValue.arrayRemove(user.uid),
            })
            firestore.collection("users").doc(user.uid).update({
                likes: firebase.firestore.FieldValue.arrayRemove(props.iD),
            })

        }
        liked = false
    }

    if (sold) unlikeItem()

    return (
        // <Link to={{
        //     pathname:"/DisplayProduct",
        //     state:[{iD: props.iD}]
        // }}
        //       style={{textDecoration: "none"}}>

        <Box position="relative">
        <Card className={classes.root}>
            <CardActionArea onClick={() => {
                history.push({pathname: "/DisplayProduct", state: {iD: props.iD}})
            }}>
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
                            {price === 0 ? "FREE" : "£" + price.toFixed(2)}
                        </Typography>
                    </Box>
                    <Divider variant="middle"/>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="textSecondary" component="p" noWrap
                                    style={{marginTop: "10px"}}>
                            {description !== "" ? description : "No description provided..."}
                        </Typography>
                    </Box>
                </CardContent>

            </CardActionArea>
            <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" justifyContent="flex-start" alignItems="center" style={{marginLeft: "15px"}}>
                <Typography variant="body2" color="textSecondary" component="p" noWrap>

                    {diffDays === 0 ?
                        "Added today"
                        :
                        ( diffDays === 1 ?
                            "Added Yesterday" :
                            `Added ${diffDays} days ago.`
                        )
                    }
                </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end" className={classes.icons} alignItems="center">
                <Tooltip title={user && seller === user.uid ? "Edit your listing" : "Message seller"}>
                    <IconButton onClick={() => {
                        user && seller === user.uid ?
                            history.push({
                                pathname: "/Product",
                                state: {
                                    iDListing: props.iD,
                                    name: name,
                                    description: description,
                                    price: price,
                                    url: imgUrl,
                                    extraUrls: allPhotos,
                                    categories: categories,
                                },
                            })
                            : (user) ?
                            (history.push({
                                pathname: "/ChatRoom",
                                state: {
                                    targetUserID: seller,
                                    targetUserName: sellerDoc.Name,
                                    myUID: user.uid,
                                    interestedProduct: name,
                                },
                            }))
                            :
                            history.push("/menu")
                    }}>
                        {user && seller === user.uid ? <Edit/> : <Chat/>}
                    </IconButton>
                </Tooltip>
                <Tooltip title={liked ? "Remove from favourites" : "Add to favourites"}>
                    <IconButton onClick={() => {
                        likeItem()
                    }}>
                        {user && likedBy.includes(user.uid) ?
                            <Grow in={user && likedBy.includes(user.uid)}><Favorite color="error"/></Grow> :
                            <FavoriteBorder/>}
                    </IconButton>
                </Tooltip>
            </Box>
            </Box>
            <Box className={(sold ? classes.soldOverlay : "")}>
                <Box className={classes.soldText}>
                    { sold ?
                        <Typography variant="h5" style={{fontSize: "25px"}}>
                            <Box fontWeight="fontWeightBold">
                                We're sorry, this listing is no longer available
                            </Box>
                        </Typography>
                        :
                        <></>
                    }
                </Box>
            </Box>

        </Card>
        </Box>

    )
}

export default HomeListingCard;