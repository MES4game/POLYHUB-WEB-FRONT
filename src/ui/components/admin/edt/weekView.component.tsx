import { FC, ReactNode, useMemo } from "react";
import "./weekView.component.css";
import { EventModel, EVENT_COLOR_UTILS } from "@/shared/models/event.model";

interface WeekViewProps {
    selecteddate: Date;
    events?     : EventModel[];
}

const WeekViewComp: FC<WeekViewProps> = ({ selecteddate, events = [] }): ReactNode => {
    const currentdate = useMemo(
        () => { return new Date(); },
        [],
    );

    const weekdays = useMemo(() => {
        const startofweek = new Date(selecteddate);
        const day = startofweek.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        startofweek.setDate(startofweek.getDate() + diff);
        
        const days = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(startofweek);
            date.setDate(startofweek.getDate() + i);
            days.push(date);
        }
        
        return days;
    }, [selecteddate]);

    const weekevents = useMemo(() => {
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
        
        weekdays.forEach((day) => {
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
    }, [weekdays, events]);

    const time_slots = useMemo(() => {
        const slots = [];

        for (let hour = 7; hour <= 18; hour++) {
            slots.push(`${hour.toString().padStart(2, "0")}H`);
        }

        return slots;
    }, []);

    const formatDayHeader = (date: Date): string => {
        const days = ["DIMANCHE", "LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"];

        return days[date.getDay()] ?? "";
    };

    const formatDateNumber = (date: Date): string => {
        return date.getDate().toString();
    };

    const isToday = (date: Date): boolean => {
        return date.toDateString() === currentdate.toDateString();
    };

    const isSelectedDate = (date: Date): boolean => {
        return date.toDateString() === selecteddate.toDateString();
    };

    const getEventPosition = (event: EventModel) => {
        const start_time = new Date(event.start_time);
        const end_time = new Date(event.end_time);
        
        const start_hour = start_time.getHours() + (start_time.getMinutes() / 60);
        const end_hour = end_time.getHours() + (end_time.getMinutes() / 60);
        
        const top = (((start_hour - 7) / 12) * 100).toString();
        const height = (((end_hour - start_hour) / 12) * 100).toString();
        
        return { top: `${top}%`, height: `${height}%` };
    };

    const formatEventTime = (date_string: string): string => {
        const date = new Date(date_string);

        return `${date.getHours().toString()
            .padStart(2, "0")}:${date.getMinutes().toString()
            .padStart(2, "0")}`;
    };

    return (
        <div className="week-view">
            <div className="week-view-header">
                <div className="time-column-header">
                    <span className="timezone-label">UTC+2</span>
                </div>

                {weekdays.map((day, index) => {
                    const classes = [
                        "day-header",
                        isToday(day) ? "today" : "",
                        isSelectedDate(day) ? "selected" : "",
                    ].filter(Boolean).join(" ");

                    return (
                        <div
                            key={index}
                            className={classes}
                        >
                            <div className="day-name">{formatDayHeader(day)}</div>
                            <div className="day-number">{formatDateNumber(day)}</div>
                        </div>
                    );
                })}
            </div>

            <div className="week-view-body">
                <div className="time-column">
                    {time_slots.map((time, index) => {
                        return (
                            <div key={index} className="time-slot">
                                <span className="time-label">{time}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="days-grid">
                    {weekdays.map((day, day_index) => {
                        const year = day.getFullYear();
                        const month = (day.getMonth() + 1)
                            .toString()
                            .padStart(2, "0");
                        const day_date = day.getDate()
                            .toString()
                            .padStart(2, "0");
                        const daykey = `${year.toString()}-${month}-${day_date}`;
                        const day_events = weekevents[daykey] ?? [];
                        
                        const column_classes = [
                            "day-column",
                            isToday(day) ? "today-column" : "",
                            isSelectedDate(day) ? "selected-column" : "",
                        ].filter(Boolean).join(" ");

                        return (
                            <div
                                key={day_index}
                                className={column_classes}
                            >
                                {time_slots.map((_, slot_index) => { return <div key={slot_index} className="time-grid-cell" />; })}
                                
                                <div className="events-container">
                                    {day_events.map((event: EventModel) => {
                                        const position = getEventPosition(event);

                                        return (
                                            <div
                                                key={event.id}
                                                className={`calendar-event-card ${EVENT_COLOR_UTILS.getCategoryBgColor(event.color)}`}
                                                style={{
                                                    top   : position.top,
                                                    height: position.height,
                                                }}
                                            >
                                                <div className={`calendar-event-border ${EVENT_COLOR_UTILS.getCategoryColor(event.color)}`} />

                                                <div className="calendar-event-content">
                                                    <div className={`calendar-event-title ${EVENT_COLOR_UTILS.getCategoryTextColor(event.color)}`}>
                                                        {event.title}
                                                    </div>

                                                    {event.category && (
                                                        <div className="calendar-event-category">
                                                            {event.category}
                                                        </div>
                                                    )}

                                                    <div className="calendar-event-time">
                                                        {formatEventTime(event.start_time)} - {formatEventTime(event.end_time)}
                                                    </div>

                                                    {event.location.length > 0 && (
                                                        <div className="calendar-event-location">
                                                            {event.location.join(", ")}
                                                        </div>
                                                    )}

                                                    {event.professor.length > 0 && (
                                                        <div className="calendar-event-professor">
                                                            {event.professor.join(", ")}
                                                        </div>
                                                    )}

                                                    {event.group.length > 0 && (
                                                        <div className="calendar-event-group">
                                                            {event.group.join(", ")}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WeekViewComp;
