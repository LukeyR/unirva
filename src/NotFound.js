import React from "react";
import {Switch, useLocation} from "react-router-dom";
import {Box, Grid, Typography} from "@material-ui/core";

function NotFound() {
    const location = useLocation();

    return (
        <Box p={1} m={1}>
            <Grid container justify="center" spacing={4}>
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" style={{width: "500px", marginTop: "50px"}} >
        <img src="https://media1.tenor.com/images/0cddbb0eab553b172db3fde6fa019130/tenor.gif" alt="error 404"/>
        <Typography variant="h1" style={{fontSize: "35px"}}>Error 404: Page not found</Typography>
                <Typography variant="h2" color="textSecondary" style={{fontSize: "25px", textAlign: "center"}}>The link you entered is not a valid link, maybe check for a typo? We may have moved or deleted the page.</Typography>
            </Box>
            </Grid>
            </Box>
    )
}

export default NotFound;