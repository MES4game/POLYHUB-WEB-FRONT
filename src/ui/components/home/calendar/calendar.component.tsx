import { FC, ReactNode, useEffect, useState } from "react";
import "@/ui/components/home/calendar/calendar.component.css";
import { CalendarFormat } from "@/ui/components/home/navbar/Format/formatButtons.component";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import { EventModel } from "@/shared/models/event.model";
import WeekView from "@/ui/components/home/calendar/weekView.component";
import DayView from "@/ui/components/home/calendar/dayView.component";
import MonthView from "@/ui/components/home/calendar/monthView.component";

interface CalendarCompProps {
    calendarformat: CalendarFormat;
}

const CalendarComp: FC<CalendarCompProps> = ({ calendarformat }): ReactNode => {
    const { selecteddate } = useGeneralVars();
    const [currentdate, setCurrentDate] = useState<Date | undefined>(selecteddate.current);
    
    const [events] = useState<EventModel[]>([
        {
            id          : "1",
            title       : "c++",
            start_time  : "2025-11-12T09:00:00",
            end_time    : "2025-11-12T11:00:00",
            location    : ["620 - B120"],
            professor   : ["FRENOUX Emmanuelle", "FONVIEILLE Marc"],
            category    : "Controle",
            group       : ["ET4 INFO"],
            color       : "red",
            is_following: true,
        },
    ]);

    useEffect(() => {
        console.log("Loaded: CalendarComp");
        
        const unsubscribe = selecteddate.subscribe((_, curr) => {
            setCurrentDate(curr);
        });

        return unsubscribe;
    }, [selecteddate]);

    useEffect(() => {
        console.log("Rendered: CalendarComp");
    });

    if (!currentdate) {
        return (
            <div id="calendar">
                <div className="calendar-content">
                    <WeekView selecteddate={new Date()} events={events} />
                </div>
            </div>
        );
    }

    const renderView = () => {
        switch (calendarformat) {
            case "week":
                return <WeekView selecteddate={currentdate} events={events} />;
            case "day":
                return <DayView selecteddate={currentdate} events={events} />;
            case "month":
                return <MonthView selecteddate={currentdate} events={events} />;
            default:
                return <WeekView selecteddate={currentdate} events={events} />;
        }
    };

    return (
        <div id="calendar">
            {renderView()}
        </div>
    );
};

export default CalendarComp;
