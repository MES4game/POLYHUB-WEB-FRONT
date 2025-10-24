import { FC, ReactNode, useEffect } from "react";
import "@/ui/components/home/calendar/calendar.component.css";
import { Button } from "#/components/ui/button";

const CalendarComp: FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: CalendarComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: CalendarComp");
    });

    return (
        <div id="calendar">
            <Button>Type me !</Button>
        </div>
    );
};

export default CalendarComp;
