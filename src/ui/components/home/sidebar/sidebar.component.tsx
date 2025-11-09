import { FC, ReactNode, useEffect } from "react";
import "@/ui/components/home/sidebar/sidebar.component.css";

import EventButtonComp from "./event/eventButton.component";
import { DaySelectorComp } from "./daySelector/daySelector.component";
import { FiltersBoxComp } from "./filters/filtersBox.component";

const SidebarComp : FC = () : ReactNode => {
    useEffect(() => {
        console.log("Loaded: NavbarComp");
    }, []);
    
    useEffect(() => {
        console.log("Rendered: NavbarComp");
    });

    return (
        <div id="sidebar">
            <EventButtonComp />
            <DaySelectorComp />
            <FiltersBoxComp />
        </div>
    );
};

export default SidebarComp;
