import React from "react";
import {Grid} from "@material-ui/core";
import MenuCard from "./MenuCard";
import {useStyles} from "./Menu";

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