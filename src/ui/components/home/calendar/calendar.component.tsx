import { FC, ReactNode, useEffect } from "react";
import "@/ui/components/home/calendar/calendar.component.css";

const CalendarComp: FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: CalendarComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: CalendarComp");
    });

    return (
        <div id="calendar">
            <p>Calendrier</p>
        </div>
    );
};

export default CalendarComp;
