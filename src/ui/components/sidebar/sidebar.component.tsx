import { FC, ReactNode, useEffect } from "react";
import "@/ui/components/sidebar/sidebar.component.css";
import { DayPicker } from "react-day-picker";

const SidebarComp : FC = () : ReactNode => {
    useEffect(() => {
        console.log("Loaded: NavbarComp");
    }, []);
    
    useEffect(() => {
        console.log("Rendered: NavbarComp");
    });

    return (
        <>
            <DayPicker />
        </>
    );
};

export default SidebarComp;
