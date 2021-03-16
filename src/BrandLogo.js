import React from "react";
import brandLogo from "./img/Brandlogo.svg";
import {CardContent, Typography} from "@material-ui/core";
import {useStyles} from "./authentication/Menu";

function BrandLogo() {
    const classes = useStyles()

    return (
<>
        <img src={brandLogo} alt="brand logo" width={175} height={175} className={classes.media} style={{ display:'flex', justifyContent:'center' }}/>
    <Typography variant="h2" className={classes.brandName} style={{ display:'flex', justifyContent:'center' }}>
        unirva
    </Typography>
</>
    )
};

export default BrandLogo;