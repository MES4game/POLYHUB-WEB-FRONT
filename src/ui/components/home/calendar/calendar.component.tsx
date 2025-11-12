import { FC, ReactNode, useEffect, useState, useMemo } from "react";
import "./calendar.component.css";
import { CalendarFormat } from "../navbar/Format/formatButtons.component";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import { useFilters } from "@/shared/contexts/common/filter.context";
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
    getGroupsByLessonId,
    getGroupById,
} from "@/api/admin.api";

interface CalendarCompProps {
    calendarformat: CalendarFormat;
}

const CalendarComp: FC<CalendarCompProps> = ({ calendarformat }): ReactNode => {
    const { selecteddate, token } = useGeneralVars();
    const { applied_groups } = useFilters();
    const [currentdate, setCurrentDate] = useState<Date | undefined>(selecteddate.current);
    const [events, setEvents] = useState<EventModel[]>([]);
    const [is_loading, setIsLoading] = useState(true);
    const [applied_filter, setAppliedFilter] = useState<string[]>([]);

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
                            const [rooms_ids_raw, teachers_ids_raw, lesson_type, lesson, groups_ids_raw] = await Promise.all([
                                getRoomsByEventId(token.current, parseInt(event.id, 10)).catch((err: unknown) => {
                                    console.error(`Error fetching rooms for event ${event.id}:`, err);

                                    return [];
                                }),
                                getTeachersByEventId(token.current, parseInt(event.id, 10)).catch((err: unknown) => {
                                    console.error(`Error fetching teachers for event ${event.id}:`, err);

                                    return [];
                                }),
                                getLessonTypeById(token.current, event.lesson_type_id).catch(() => { return null; }),
                                getLessonById(token.current, event.lesson_id).catch(() => { return null; }),
                                getGroupsByLessonId(token.current, event.lesson_id, event.lesson_type_id, event.lesson_arg).catch((err: unknown) => {
                                    console.error(`Error fetching groups for event ${event.id}:`, err);

                                    return [];
                                }),
                            ]);

                            // Ensure we have arrays (handle API returning non-array values)
                            const rooms_ids = Array.isArray(rooms_ids_raw) ? rooms_ids_raw : [];
                            const teachers_ids = Array.isArray(teachers_ids_raw) ? teachers_ids_raw : [];
                            const groups_ids = Array.isArray(groups_ids_raw) ? groups_ids_raw : [];

                            console.log(`Event ${event.id} - Room IDs:`, rooms_ids);
                            console.log(`Event ${event.id} - Teacher IDs:`, teachers_ids);
                            console.log(`Event ${event.id} - Group IDs:`, groups_ids);

                            // Fetch room details
                            const rooms = await Promise.all(
                                rooms_ids.map(async (room_id) => {
                                    try {
                                        const room = await getRoomById(token.current, room_id);

                                        if (room) {
                                            try {
                                                const building = await getBuildingById(token.current, room.building_id);
                                                
                                                console.log(`Fetched building ${building?.name ?? "unknown"} for room ${room.name}`);

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

                            console.log(`Event ${event.id} - Fetched rooms:`, rooms);

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

                            // Fetch group names
                            const groups = await Promise.all(
                                groups_ids.map(async (group_id) => {
                                    try {
                                        const group = await getGroupById(token.current, group_id);

                                        if (group) {
                                            return group.name;
                                        }

                                        return `Group ${String(group_id)}`;
                                    }
                                    catch(group_error) {
                                        console.error(`Error fetching group ${String(group_id)}:`, group_error);

                                        return `Group ${String(group_id)}`;
                                    }
                                }),
                            );

                            console.log(`Event ${event.id} - Fetched groups:`, groups);

                            // Default color, could be based on lesson_type
                            const color: EventColor = "blue";

                            const final_event = {
                                id          : event.id,
                                title       : lesson?.name ?? `Lesson ${String(event.lesson_id)}`,
                                start_time  : event.start.toISOString(),
                                end_time    : event.end.toISOString(),
                                location    : rooms,
                                professor   : teachers,
                                category    : lesson_type?.name ?? `Type ${String(event.lesson_type_id)}`,
                                group       : groups.length > 0 ? groups : ["No group"],
                                group_ids   : groups_ids,
                                sub_group   : event.lesson_arg,
                                color,
                                is_following: true,
                            } as EventModel;

                            console.log(`Event ${event.id} - Final event:`, final_event);
                            console.log(`Event ${event.id} - Location array:`, final_event.location);

                            return final_event;
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
                                group       : ["Unknown"],
                                group_ids   : [],
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

    // Subscribe to applied_groups changes
    useEffect(() => {
        const unsubscribe = applied_groups.subscribe((_, curr) => {
            setAppliedFilter([...curr]);
        });

        return unsubscribe;
    }, [applied_groups]);

    useEffect(() => {
        console.log("Rendered: CalendarComp");
    });

    // Filter events based on applied groups
    const filtered_events = useMemo(() => {
        // If no groups are applied, show all events
        if (applied_filter.length === 0) {
            return events;
        }

        // Convert applied_filter (string IDs) to numbers for comparison
        const selected_group_ids = applied_filter.map((id) => { return parseInt(id, 10); });

        // Filter events that belong to the selected groups
        return events.filter((event) => {
            // Check if any of the event's group IDs match any of the selected group IDs
            return event.group_ids.some((group_id) => {
                return selected_group_ids.includes(group_id);
            });
        });
    }, [events, applied_filter]);

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
                    <WeekViewComp selecteddate={new Date()} events={filtered_events} />
                </div>
            </div>
        );
    }

    const renderView = () => {
        switch (calendarformat) {
            case "week":
                return <WeekViewComp selecteddate={currentdate} events={filtered_events} />;
            case "day":
                return <DayViewComp selecteddate={currentdate} events={filtered_events} />;
            case "month":
                return <MonthViewComp selecteddate={currentdate} events={filtered_events} />;
            default:
                return <WeekViewComp selecteddate={currentdate} events={filtered_events} />;
        }
    };

    return (
        <div id="calendar">
            {renderView()}
        </div>
    );
};

export default CalendarComp;
