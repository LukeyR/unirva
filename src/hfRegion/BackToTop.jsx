import * as React from "react"
import {useScrollTrigger, Zoom} from "@material-ui/core"

const style = {
    position: `fixed`,
    bottom: `5%`,
    right: `7.5%`,
    zIndex: `99`,
}
const BackToTop = ({children}) => {
    const trigger = useScrollTrigger()
    const handleClick = event => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            "#back-to-top-anchor"
        )
        if (anchor) {
            anchor.scrollIntoView({behavior: "smooth", block: "center"})
        }
    }
    return (
        <Zoom in={trigger}>
            <div onClick={handleClick} role="presentation" style={style}>
                {children}
            </div>
        </Zoom>
    )
}
export default BackToTop