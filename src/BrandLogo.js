import React from "react";
import brandLogo from "./img/Brandlogo.svg";
import {CardContent, Typography} from "@material-ui/core";
import {useStyles} from "./authentication/Menu";

function BrandLogo(props) {
    const classes = useStyles()

    return (
<>
        <img src={brandLogo} alt="brand logo" width={props.width ? props.width : 175} height={props.height ? props.height : 175} className={classes.media} style={{ display:'flex', justifyContent:'center' }}/>
    <Typography variant="h2" className={classes.brandName} style={{ display:'flex', justifyContent:'center' }}>
        unirva
    </Typography>
</>
    )
};

export default BrandLogo;