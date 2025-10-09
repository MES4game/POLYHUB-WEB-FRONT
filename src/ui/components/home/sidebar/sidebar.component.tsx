import { FC, ReactNode, useEffect } from "react";
import "@/ui/components/home/sidebar/sidebar.component.css";

import { DaySelectorComp } from "./daySelector/daySelector.component";

const SidebarComp : FC = () : ReactNode => {
    useEffect(() => {
        console.log("Loaded: NavbarComp");
    }, []);
    
    useEffect(() => {
        console.log("Rendered: NavbarComp");
    });

    return (
        <div id="sidebar">
            <DaySelectorComp />
        </div>
    );
};

export default SidebarComp;
