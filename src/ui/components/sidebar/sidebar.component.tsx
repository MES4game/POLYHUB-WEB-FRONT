import { FC, ReactNode, useEffect } from "react";
import "@/ui/components/sidebar/sidebar.component.css"

const SidebarComp : FC = () : ReactNode => {
    useEffect(() => {
        console.log("Loaded: NavbarComp");
    }, []);
    
    useEffect(() => {
        console.log("Rendered: NavbarComp");
    });

    return (
        <>
            <p>Sidebar</p>
        </>
    )
}

export default SidebarComp;