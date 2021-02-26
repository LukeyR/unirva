import React from 'react';
import {AppBar, Toolbar, Typography} from "@material-ui/core";
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles( () => ({
    typographyStyles: {
        flex: 1,
        justifyContent: "left",
        alignContent: "left",
    },
}));

const Header = () => {
    const classes = useStyles();

    return (
        <AppBar position="static" elevation={0}>
            <Toolbar>
                <Typography className={classes.typographyStyles}>
                    brand name
                </Typography>
                <AccountCircleTwoToneIcon />
            </Toolbar>
        </AppBar>
    )
}

export default Header;