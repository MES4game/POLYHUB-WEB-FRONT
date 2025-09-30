import { FC, ReactNode, useEffect } from "react";
import "@/ui/pages/home/home.page.css";
import NavbarComp from "@/ui/components/navbar/navbar.component";
import CalendarComp from "@/ui/components/calendar/calendar.component";
import InfobarComp from "@/ui/components/infobar/infobar.component";
import SidebarComp from "@/ui/components/sidebar/sidebar.component";


const HomePage: FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: HomePage");
    }, []);

    useEffect(() => {
        console.log("Rendered: HomePage");
    });

    return (
        <div id="home-page">
            <NavbarComp />
            <SidebarComp />
            <CalendarComp />
        </div>
    );
};

export default HomePage;
