import { FC, ReactNode, useEffect, useState } from "react";
import "@/ui/pages/home/home.page.css";
import NavbarComp from "@/ui/components/home/navbar/navbar.component";
import CalendarComp from "@/ui/components/home/calendar/calendar.component";
import SidebarComp from "@/ui/components/home/sidebar/sidebar.component";
import { CalendarFormat } from "@/ui/components/home/navbar/Format/formatButtons.component";
import { FilterProvider } from "@/shared/contexts/common/filter.context";


const HomePage: FC = (): ReactNode => {
    const [calendarformat, setCalendarFormat] = useState<CalendarFormat>("week");

    useEffect(() => {
        console.log("Loaded: HomePage");
    }, []);

    useEffect(() => {
        console.log("Rendered: HomePage");
    });

    return (
        <FilterProvider>
            <div id="home-page">
                <NavbarComp
                    calendarformat={calendarformat}
                    onFormatChange={setCalendarFormat}
                />

                <SidebarComp />
                <CalendarComp calendarformat={calendarformat} />
            </div>
        </FilterProvider>
    );
};

export default HomePage;
