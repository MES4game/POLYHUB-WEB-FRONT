import { FC, ReactNode, useEffect } from "react";
import "@/ui/components/home/sidebar/sidebar.component.css";

const SidebarComp : FC = () : ReactNode => {
    useEffect(() => {
        console.log("Loaded: NavbarComp");
    }, []);
    
    useEffect(() => {
        console.log("Rendered: NavbarComp");
    });

    return (
        <div id="sidebar">
            <p>Sidebar</p>
        </div>
    );
};

export default SidebarComp;
