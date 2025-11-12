import { FC, ReactNode, useEffect, useState } from "react";
import "./calendar.component.css";
import { CalendarFormat } from "./formatButtons.component";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import { EventModel, EventColor } from "@/shared/models/event.model";
import WeekViewComp from "./weekView.component";
import DayViewComp from "./dayView.component";
import MonthViewComp from "./monthView.component";
import {
    getAllEvents,
    getRoomsByEventId,
    getTeachersByEventId,
    getLessonTypeById,
    getLessonById,
    getRoomById,
    getBuildingById,
    getUserNameById,
} from "@/api/admin.api";

interface CalendarCompProps {
    calendarformat: CalendarFormat;
}

const CalendarComp: FC<CalendarCompProps> = ({ calendarformat }): ReactNode => {
    const { selecteddate, token } = useGeneralVars();
    const [currentdate, setCurrentDate] = useState<Date | undefined>(selecteddate.current);
    const [events, setEvents] = useState<EventModel[]>([]);
    const [is_loading, setIsLoading] = useState(true);

    // Fetch events from API
    useEffect(() => {
        async function fetchEvents() {
            if (!token.current) return;

            setIsLoading(true);

            try {
                const raw_events = await getAllEvents(token.current);

                // Transform SubEventReturn[] to EventModel[]
                const transformed_events = await Promise.all(
                    raw_events.map(async (event) => {
                        try {
                            // Fetch related data in parallel
                            const [rooms_ids_raw, teachers_ids_raw, lesson_type, lesson] = await Promise.all([
                                getRoomsByEventId(token.current, parseInt(event.id, 10)).catch(() => { return []; }),
                                getTeachersByEventId(token.current, parseInt(event.id, 10)).catch(() => { return []; }),
                                getLessonTypeById(token.current, event.lesson_type_id).catch(() => { return null; }),
                                getLessonById(token.current, event.lesson_id).catch(() => { return null; }),
                            ]);

                            // Ensure we have arrays (handle API returning non-array values)
                            const rooms_ids = Array.isArray(rooms_ids_raw) ? rooms_ids_raw : [];
                            const teachers_ids = Array.isArray(teachers_ids_raw) ? teachers_ids_raw : [];

                            // Fetch room details
                            const rooms = await Promise.all(
                                rooms_ids.map(async (room_id) => {
                                    try {
                                        const room = await getRoomById(token.current, room_id);

                                        if (room) {
                                            try {
                                                const building = await getBuildingById(token.current, room.building_id);

                                                return building ? `${building.name} - ${room.name}` : room.name;
                                            }
                                            catch(building_error) {
                                                console.error(`Error fetching building ${String(room.building_id)}:`, building_error);

                                                return room.name;
                                            }
                                        }

                                        return `Room ${String(room_id)}`;
                                    }
                                    catch(room_error) {
                                        console.error(`Error fetching room ${String(room_id)}:`, room_error);

                                        return `Room ${String(room_id)}`;
                                    }
                                }),
                            );

                            // Fetch teacher names
                            const teachers = await Promise.all(
                                teachers_ids.map(async (teacher_id) => {
                                    try {
                                        const names = await getUserNameById(token.current, teacher_id);

                                        if (names?.[0] && names[1]) {
                                            return `${names[0]} ${names[1]}`;
                                        }

                                        return `Teacher ${String(teacher_id)}`;
                                    }
                                    catch(teacher_error) {
                                        console.error(`Error fetching teacher ${String(teacher_id)}:`, teacher_error);

                                        return `Teacher ${String(teacher_id)}`;
                                    }
                                }),
                            );

                            // Default color, could be based on lesson_type
                            const color: EventColor = "blue";

                            // Placeholder - groupe getters missing
                            const group_placeholder = ["ET4 INFO"];

                            return {
                                id          : event.id,
                                title       : lesson?.name ?? `Lesson ${String(event.lesson_id)}`,
                                start_time  : event.start.toISOString(),
                                end_time    : event.end.toISOString(),
                                location    : rooms,
                                professor   : teachers,
                                category    : lesson_type?.name ?? `Type ${String(event.lesson_type_id)}`,
                                group       : group_placeholder,
                                sub_group   : event.lesson_arg,
                                color,
                                is_following: true,
                            } as EventModel;
                        }
                        catch(error) {
                            console.error(`Error transforming event ${event.id}:`, error);

                            // Return a minimal event on error
                            return {
                                id          : event.id,
                                title       : `Event ${event.id}`,
                                start_time  : event.start.toISOString(),
                                end_time    : event.end.toISOString(),
                                location    : [],
                                professor   : [],
                                category    : "Unknown",
                                group       : ["ET4 INFO"],
                                sub_group   : event.lesson_arg,
                                color       : "blue" as EventColor,
                                is_following: false,
                            } as EventModel;
                        }
                    }),
                );

                setEvents(transformed_events);
            }
            catch(error) {
                console.error("Error fetching events:", error);
                setEvents([]);
            }
            finally {
                setIsLoading(false);
            }
        }

        void fetchEvents();
    }, [token]);

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

    if (is_loading) {
        return (
            <div id="calendar">
                <div className="calendar-content">
                    <div className="flex items-center justify-center h-full">
                        <p>Chargement des événements...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentdate) {
        return (
            <div id="calendar">
                <div className="calendar-content">
                    <WeekViewComp selecteddate={new Date()} events={events} />
                </div>
            </div>
        );
    }

    const renderView = () => {
        switch (calendarformat) {
            case "week":
                return <WeekViewComp selecteddate={currentdate} events={events} />;
            case "day":
                return <DayViewComp selecteddate={currentdate} events={events} />;
            case "month":
                return <MonthViewComp selecteddate={currentdate} events={events} />;
            default:
                return <WeekViewComp selecteddate={currentdate} events={events} />;
        }
    };

    return (
        <div id="calendar">
            {renderView()}
        </div>
    );
};

export default CalendarComp;
