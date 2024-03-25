import { Link, NavLink, useLocation } from "@solidjs/router";
import { lazy } from "solid-js";
import { Button } from "@suid/material";

const MenuTracking = () => {

    const navi = (link) => {
        return `/deck-explorer/direct-tracking/${link}`
    }

    return <div className=" mt-3 p-1 flex gap-2">
        <NavLink href={navi("single-target")} activeClass="border-b-2 border-blue-400">
            <Button color="secondary" variant="contained" >One Time Tracking</Button>
        </NavLink>
        <NavLink href={navi("geofencing")} activeClass="border-b-2 border-blue-400">
            <Button color="secondary" variant="contained">Scheduled Tracking</Button>
        </NavLink>
        <NavLink href="/">
            <Button color="secondary" variant="contained">Location Intelligence</Button>
        </NavLink>
    </div>
}

export default MenuTracking