import { FC, ReactNode, useMemo } from "react";
import "@/ui/components/home/calendar/monthView.component.css";
import { EventModel, EVENT_COLOR_UTILS } from "@/shared/models/event.model";

interface MonthViewProps {
    selecteddate: Date;
    events?     : EventModel[];
}

const MonthViewComp: FC<MonthViewProps> = ({ selecteddate, events = [] }): ReactNode => {
    const currentdate = useMemo(
        () => { return new Date(); },
        [],
    );

    const monthdays = useMemo(() => {
        const year = selecteddate.getFullYear();
        const month = selecteddate.getMonth();
        
        // First day of the month
        const firstday = new Date(year, month, 1);
        const firstdayofweek = firstday.getDay();
        
        // Last day of the month
        const lastday = new Date(year, month + 1, 0);
        const lastdaydate = lastday.getDate();
        
        // Calculate the days to show from previous month
        const prevmonthdays = firstdayofweek === 0 ? 6 : firstdayofweek - 1;
        const prevmonth = new Date(year, month, 0);
        const prevmonthlastdate = prevmonth.getDate();
        
        const days: Date[] = [];
        
        // Add previous month days
        for (let i = prevmonthdays; i > 0; i--) {
            days.push(new Date(year, month - 1, prevmonthlastdate - i + 1));
        }
        
        // Add current month days
        for (let i = 1; i <= lastdaydate; i++) {
            days.push(new Date(year, month, i));
        }
        
        // Add next month days to complete the grid (42 days = 6 weeks)
        const remainingdays = 42 - days.length;

        for (let i = 1; i <= remainingdays; i++) {
            days.push(new Date(year, month + 1, i));
        }
        
        return days;
    }, [selecteddate]);

    const monthevents = useMemo(() => {
        const eventsmap: Record<string, EventModel[]> = {};
        
        const getLocalDateKey = (date: Date): string => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1)
                .toString()
                .padStart(2, "0");
            const day = date.getDate()
                .toString()
                .padStart(2, "0");

            return `${year.toString()}-${month}-${day}`;
        };
        
        monthdays.forEach((day) => {
            const daykey = getLocalDateKey(day);
            eventsmap[daykey] = [];
        });
        
        events.forEach((event) => {
            const event_date = new Date(event.start_time);
            const event_key = getLocalDateKey(event_date);
            
            if (eventsmap[event_key]) {
                eventsmap[event_key].push(event);
            }
        });
        
        return eventsmap;
    }, [monthdays, events]);

    const formatMonthYear = (date: Date): string => {
        const months = [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
        ];
        const month = months[date.getMonth()] ?? "Janvier";
        const year = date.getFullYear();

        return `${month} ${year.toString()}`;
    };

    const formatDayName = (index: number): string => {
        const days = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];

        return days[index] ?? "";
    };

    const isToday = (date: Date): boolean => {
        return date.toDateString() === currentdate.toDateString();
    };

    const isSelectedDate = (date: Date): boolean => {
        return date.toDateString() === selecteddate.toDateString();
    };

    const isCurrentMonth = (date: Date): boolean => {
        return date.getMonth() === selecteddate.getMonth();
    };

    const formatEventTime = (date_string: string): string => {
        const date = new Date(date_string);

        return `${date.getHours().toString()
            .padStart(2, "0")}:${date.getMinutes().toString()
            .padStart(2, "0")}`;
    };

    const getDateKey = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1)
            .toString()
            .padStart(2, "0");
        const day = date.getDate()
            .toString()
            .padStart(2, "0");

        return `${year.toString()}-${month}-${day}`;
    };

    return (
        <div className="month-view">
            <div className="month-view-header">
                <div className="month-title">{formatMonthYear(selecteddate)}</div>
            </div>

            <div className="month-view-calendar">
                <div className="weekdays-header">
                    {[0, 1, 2, 3, 4, 5, 6].map((index) => {
                        return (
                            <div key={index} className="weekday-name">
                                {formatDayName(index)}
                            </div>
                        );
                    })}
                </div>

                <div className="month-grid">
                    {monthdays.map((day, index) => {
                        const daykey = getDateKey(day);
                        const day_events = monthevents[daykey] ?? [];
                        
                        const day_classes = [
                            "month-day",
                            isToday(day) ? "today" : "",
                            isSelectedDate(day) ? "selected" : "",
                            !isCurrentMonth(day) ? "other-month" : "",
                        ].filter(Boolean).join(" ");

                        return (
                            <div key={index} className={day_classes}>
                                <div className="day-date-number">
                                    {day.getDate()}
                                </div>
                                
                                <div className="day-events-container">
                                    {day_events.slice(0, 3).map((event: EventModel) => {
                                        return (
                                            <div
                                                key={event.id}
                                                className={`month-event-card ${EVENT_COLOR_UTILS.getCategoryBgColor(event.color)}`}
                                            >
                                                <div className={`month-event-dot ${EVENT_COLOR_UTILS.getCategoryColor(event.color)}`} />
                                                
                                                <div className="month-event-content">
                                                    <div className={`month-event-title ${EVENT_COLOR_UTILS.getCategoryTextColor(event.color)}`}>
                                                        {event.title}
                                                    </div>
                                                    
                                                    <div className="month-event-time">
                                                        {formatEventTime(event.start_time)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {day_events.length > 3 && (
                                        <div className="more-events-indicator">
                                            +{day_events.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MonthViewComp;
