import { FC, ReactNode, useMemo } from "react";
import "./dayView.component.css";
import { EventModel, EVENT_COLOR_UTILS } from "@/shared/models/event.model";

interface DayViewProps {
    selecteddate: Date;
    events?     : EventModel[];
}

const DayViewComp: FC<DayViewProps> = ({ selecteddate, events = [] }): ReactNode => {
    const currentdate = useMemo(
        () => { return new Date(); },
        [],
    );

    const dayevents = useMemo(() => {
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

        const selectedkey = getLocalDateKey(selecteddate);
        
        return events.filter((event) => {
            const event_date = new Date(event.start_time);
            const event_key = getLocalDateKey(event_date);

            return event_key === selectedkey;
        });
    }, [selecteddate, events]);

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

    const formatFullDate = (date: Date): string => {
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

    const isToday = (date: Date): boolean => {
        return date.toDateString() === currentdate.toDateString();
    };

    const getEventPosition = (event: EventModel, overlapping_events: EventModel[]) => {
        const start_time = new Date(event.start_time);
        const end_time = new Date(event.end_time);
        
        const start_hour = start_time.getHours() + (start_time.getMinutes() / 60);
        const end_hour = end_time.getHours() + (end_time.getMinutes() / 60);
        
        const top = (((start_hour - 7) / 12) * 100).toString();
        const height = (((end_hour - start_hour) / 12) * 100).toString();
        
        // Calculate horizontal positioning for overlapping events
        const total_overlapping = overlapping_events.length;
        const event_index = overlapping_events.findIndex((e) => { return e.id === event.id; });
        const width_percent = total_overlapping > 1 ? 100 / total_overlapping : 100;
        const left_percent = total_overlapping > 1 ? (event_index * width_percent) : 0;
        
        return {
            top   : `${top}%`,
            height: `${height}%`,
            width : `${width_percent.toString()}%`,
            left  : `${left_percent.toString()}%`,
        };
    };

    const getOverlappingEvents = (event: EventModel): EventModel[] => {
        const event_start = new Date(event.start_time).getTime();
        const event_end = new Date(event.end_time).getTime();
        
        return dayevents.filter((other_event) => {
            const other_start = new Date(other_event.start_time).getTime();
            const other_end = new Date(other_event.end_time).getTime();
            
            return event_start < other_end && event_end > other_start;
        });
    };

    const formatEventTime = (date_string: string): string => {
        const date = new Date(date_string);

        return `${date.getHours().toString()
            .padStart(2, "0")}:${date.getMinutes().toString()
            .padStart(2, "0")}`;
    };

    return (
        <div className="day-view">
            <div className="day-view-header">
                <div className="time-column-header">
                    <span className="timezone-label">UTC+2</span>
                </div>

                <div className={`day-header ${isToday(selecteddate) ? "today" : ""}`}>
                    <div className="day-name">{formatDayHeader(selecteddate)}</div>
                    <div className="day-number">{formatDateNumber(selecteddate)}</div>
                    <div className="day-month">{formatFullDate(selecteddate)}</div>
                </div>
            </div>

            <div className="day-view-body">
                <div className="time-column">
                    {time_slots.map((time, index) => {
                        return (
                            <div key={index} className="time-slot">
                                <span className="time-label">{time}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="day-grid">
                    <div className={`day-column ${isToday(selecteddate) ? "today-column" : ""}`}>
                        {time_slots.map((_, slot_index) => { return <div key={slot_index} className="time-grid-cell" />; })}
                        
                        <div className="events-container">
                            {dayevents.map((event: EventModel) => {
                                const overlapping_events = getOverlappingEvents(event);
                                const position = getEventPosition(event, overlapping_events);

                                // Debug: Log event data
                                console.log("Rendering event:", event.id, "Location:", event.location, "Location length:", event.location.length);

                                return (
                                    <div
                                        key={event.id}
                                        className={`calendar-event-card ${EVENT_COLOR_UTILS.getCategoryBgColor(event.color)}`}
                                        style={{
                                            top   : position.top,
                                            height: position.height,
                                            width : position.width,
                                            left  : position.left,
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
                </div>
            </div>
        </div>
    );
};

export default DayViewComp;
