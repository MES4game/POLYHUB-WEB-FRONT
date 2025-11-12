"use client";

import * as React from "react";
import { BoxHeaderComp } from "./boxHeader.component";
import { FiltersSelectComp } from "./filtersSelect.component";
import { FiltersEventComp } from "./filtersEvent.component";
import { EventModel } from "@/shared/models/event.model";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import { useFilters } from "@/shared/contexts/common/filter.context";
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
import { EventColor } from "@/shared/models/event.model";

import "@/ui/components/home/sidebar/filters/filtersBox.component.css";

type HeaderView = "events" | "filters";

/**
 * Formats a date to a human-readable string in French
 */
const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year   : "numeric",
        month  : "long",
        day    : "numeric",
    };

    return date.toLocaleDateString("fr-FR", options);
};

/**
 * Formats a time from ISO string to HH:MM format
 */
const formatTime = (iso_string: string): string => {
    const date = new Date(iso_string);

    return date.toLocaleTimeString("fr-FR", {
        hour  : "2-digit",
        minute: "2-digit",
    });
};

/**
 * Checks if two dates are the same day
 */
const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate()
    );
};

/**
 * Filters events that occur on the specified date
 */
const filterEventsByDate = (events: EventModel[], target_date: Date): EventModel[] => {
    return events.filter((event) => {
        const event_date = new Date(event.start_time);

        return isSameDay(event_date, target_date);
    });
};

/**
 * Sorts events by start time (earliest first)
 */
const sortEventsByTime = (events: EventModel[]): EventModel[] => {
    return [...events].sort((a, b) => {
        const time_a = new Date(a.start_time).getTime();
        const time_b = new Date(b.start_time).getTime();

        return time_a - time_b;
    });
};

export const FiltersBoxComp = () => {
    const [active_view, setActiveView] = React.useState<HeaderView>("events");
    const [events, setEvents] = React.useState<EventModel[]>([]);
    const [is_loading, setIsLoading] = React.useState(true);

    const { selecteddate, token } = useGeneralVars();
    const { applied_groups } = useFilters();
    const [current_date, setCurrentDate] = React.useState<Date>(selecteddate.current ?? new Date());

    // Subscribe to selected date changes
    React.useEffect(() => {
        const unsubscribe = selecteddate.subscribe((_, new_date) => {
            if (new_date) {
                setCurrentDate(new_date);
            }
        });

        return unsubscribe;
    }, [selecteddate]);

    // Fetch events from API
    React.useEffect(() => {
        const fetchEvents = async () => {
            if (!token.current) {
                setIsLoading(false);

                return;
            }

            setIsLoading(true);

            try {
                const raw_events = await getAllEvents(token.current);

                const transformed_events = await Promise.all(
                    raw_events.map(async (event) => {
                        try {
                            const [rooms_ids_raw, teachers_ids_raw, lesson_type, lesson, groups_ids_raw] = await Promise.all([
                                getRoomsByEventId(token.current, parseInt(event.id, 10)).catch(() => { return []; }),
                                getTeachersByEventId(token.current, parseInt(event.id, 10)).catch(() => { return []; }),
                                getLessonTypeById(token.current, event.lesson_type_id).catch(() => { return null; }),
                                getLessonById(token.current, event.lesson_id).catch(() => { return null; }),
                                getGroupsByLessonId(token.current, event.lesson_id, event.lesson_type_id, event.lesson_arg).catch(() => { return []; }), // eslint-disable-line
                            ]);

                            const rooms_ids = Array.isArray(rooms_ids_raw) ? rooms_ids_raw : [];
                            const teachers_ids = Array.isArray(teachers_ids_raw) ? teachers_ids_raw : [];
                            const groups_ids = Array.isArray(groups_ids_raw) ? groups_ids_raw : [];

                            // Fetch room details with building names
                            const rooms = await Promise.all(
                                rooms_ids.map(async (room_id) => {
                                    try {
                                        const room = await getRoomById(token.current, room_id);

                                        if (room) {
                                            try {
                                                const building = await getBuildingById(token.current, room.building_id);

                                                return building ? `${building.name} - ${room.name}` : room.name;
                                            }
                                            catch {
                                                return room.name;
                                            }
                                        }

                                        return `Salle ${String(room_id)}`;
                                    }
                                    catch {
                                        return `Salle ${String(room_id)}`;
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

                                        return `Enseignant ${String(teacher_id)}`;
                                    }
                                    catch {
                                        return `Enseignant ${String(teacher_id)}`;
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

                                        return `Groupe ${String(group_id)}`;
                                    }
                                    catch {
                                        return `Groupe ${String(group_id)}`;
                                    }
                                }),
                            );

                            const color: EventColor = "blue";

                            return {
                                id          : event.id,
                                title       : lesson?.name ?? `Cours ${String(event.lesson_id)}`,
                                start_time  : event.start.toISOString(),
                                end_time    : event.end.toISOString(),
                                location    : rooms,
                                professor   : teachers,
                                category    : lesson_type?.name ?? "Autre",
                                group       : groups.length > 0 ? groups : [],
                                group_ids   : groups_ids,
                                sub_group   : event.lesson_arg,
                                color,
                                is_following: true,
                            } as EventModel;
                        }
                        catch(error) {
                            console.error(`Error transforming event ${event.id}:`, error);

                            return {
                                id          : event.id,
                                title       : `Événement ${event.id}`,
                                start_time  : event.start.toISOString(),
                                end_time    : event.end.toISOString(),
                                location    : [],
                                professor   : [],
                                category    : "Inconnu",
                                group       : [],
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
        };

        void fetchEvents();
    }, [token]);

    // Filter and sort events for the current day
    const current_day_events = React.useMemo(() => {
        let filtered = filterEventsByDate(events, current_date);

        /* Apply group filter if groups are selected */
        if (applied_groups.current.length > 0) {
            // Convert applied_groups (string IDs) to numbers for comparison
            const selected_group_ids = applied_groups.current.map((id) => { return parseInt(id, 10); });

            filtered = filtered.filter((event) => {
                // Check if any of the event's group IDs match any of the selected group IDs
                return event.group_ids.some((group_id) => {
                    return selected_group_ids.includes(group_id);
                });
            });
        }

        const sorted = sortEventsByTime(filtered);

        return sorted.map((event) => {
            return {
                ...event,
                start_time: formatTime(event.start_time),
                end_time  : formatTime(event.end_time),
            };
        });
    }, [events, current_date, applied_groups]);

    const renderEventsView = () => {
        if (is_loading) {
            return (
                <div className="flex items-center justify-center h-32">
                    <p className="text-sm text-gray-500">Chargement des événements...</p>
                </div>
            );
        }

        if (current_day_events.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-32 text-center px-4">
                    <p className="text-sm text-gray-500 mb-1">Aucun événement prévu</p>

                    <p className="text-xs text-gray-400">
                        pour le {formatDate(current_date)}
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-3 pr-1">
                {current_day_events.map((event) => {
                    return <FiltersEventComp key={event.id} event={event} />;
                })}
            </div>
        );
    };

    return (
        <div className="w-full h-full flex items-start justify-center px-4 pb-4 overflow-hidden">
            <div className="w-full max-w-sm h-full rounded-lg border shadow-md bg-white p-4 flex flex-col overflow-hidden">
                <BoxHeaderComp activeview={active_view} onViewChange={setActiveView} />

                {active_view === "events" && (
                    <p className="text-sm text-gray-500 mb-3 px-1">
                        {formatDate(current_date)}
                    </p>
                )}

                <div className="flex-1 overflow-y-auto event-container min-h-0">
                    {active_view === "events"
                        ? renderEventsView()
                        : (
                            <div>
                                <FiltersSelectComp />
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};
