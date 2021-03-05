import {createMuiTheme} from "@material-ui/core";
import lightBlue from "@material-ui/core/colors/lightBlue"
import pink from "@material-ui/core/colors/pink"

const theme = createMuiTheme({
    palette: {
        primary: {
            main: lightBlue[400],
        },
        secondary: {
            main: pink[300],
        },
    },
});

export default theme;