import { FC, ReactNode, useEffect, useState } from "react";
import "@/ui/components/home/calendar/calendar.component.css";
import { CalendarFormat } from "@/ui/components/home/navbar/Format/formatButtons.component";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import { EventModel } from "@/shared/models/event.model";
import WeekView from "@/ui/components/home/calendar/weekView.component";

interface CalendarCompProps {
    calendarformat: CalendarFormat;
}

const CalendarComp: FC<CalendarCompProps> = ({ calendarformat }): ReactNode => {
    const { selecteddate } = useGeneralVars();
    const [currentdate, setCurrentDate] = useState<Date | undefined>(selecteddate.current);
    
    // Mock events - replace with actual data from API
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

    // Render different views based on calendar format
    const renderView = () => {
        switch (calendarformat) {
            case "week":
                return <WeekView selecteddate={currentdate} events={events} />;
            case "day":
                return (
                    <div className="calendar-content">
                        <p>Vue journalière (à implémenter)</p>
                    </div>
                );
            case "month":
                return (
                    <div className="calendar-content">
                        <p>Vue mensuelle (à implémenter)</p>
                    </div>
                );
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
