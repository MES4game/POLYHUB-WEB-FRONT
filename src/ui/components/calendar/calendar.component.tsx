import { FC, ReactNode, useEffect } from "react";
import "@/ui/components/calendar/calendar.component.css";

const CalendarComp: FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: CalendarComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: CalendarComp");
    });

    return (
        <div className="calendarComp">
            <p>Calendrier</p>
        </div>
    );
};

export default CalendarComp;
