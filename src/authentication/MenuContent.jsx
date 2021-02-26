import React from "react";
import {makeStyles} from "@material-ui/styles";
import {Grid} from "@material-ui/core";
import MenuCard from "./MenuCard";

const useStyles = makeStyles({
    div: {
        margin: 0,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    }
})

const Content = () => {

    const classes = useStyles();

    return (
        <div className={classes.div}>
            <Grid container>
                <Grid item>
                    <MenuCard/>
                </Grid>
            </Grid>
        </div>
    )
};

export default Content;