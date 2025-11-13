import { FC, ReactNode, useState, useRef, useEffect, useMemo } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "#/components/ui/dialog";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Calendar } from "#/components/ui/calendar";
import { Check, Search, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "#/lib/utils";
import {
    getAllRooms,
    getAllBuildings,
    getAllGroups,
    getLessonType,
    getLessons,
    setNewEvent,
    linkLessonToGroup,
    linkRoomToEvent,
    linkTeacherToEvent,
} from "@/api/admin.api";
import { getAllTeachers } from "@/api/user.api";
import { Location } from "@/shared/models/common/location.model";
import { Lesson } from "@/shared/models/common/lesson.model";
import { User } from "@/shared/models/user.model";
import { useGeneralVars } from "@/shared/contexts/common/general.context";

import "./eventDialog.component.css";

interface EventDialogProps {
    isopen : boolean;
    onClose: () => void;
}

export const EventDialogComp: FC<EventDialogProps> = ({ isopen, onClose }): ReactNode => {
    const { token } = useGeneralVars();
    const [locations, setLocations] = useState<{ value: string; label: string }[]>([]);
    const [is_loading_locations, setIsLoadingLocations] = useState(true);
    const [teachers, setTeachers] = useState<{ value: string; label: string }[]>([]);
    const [is_loading_teachers, setIsLoadingTeachers] = useState(true);
    const [promos, setPromos] = useState<{ value: string; label: string }[]>([]);
    const [is_loading_promos, setIsLoadingPromos] = useState(true);
    const [all_groups, setAllGroups] = useState<{ value: string; label: string; parent_id: number | null }[]>([]);
    const [lesson_types, setLessonTypes] = useState<{ value: string; label: string }[]>([]);
    const [is_loading_lesson_types, setIsLoadingLessonTypes] = useState(true);
    const [lessons, setLessons] = useState<{ value: string; label: string }[]>([]);
    const [is_loading_lessons, setIsLoadingLessons] = useState(true);
    const [selected_locations, setSelectedLocations] = useState<string[]>([]);
    const [is_location_open, setIsLocationOpen] = useState(false);
    const [selected_professors, setSelectedProfessors] = useState<string[]>([]);
    const [is_professor_open, setIsProfessorOpen] = useState(false);
    const [selected_promo, setSelectedPromo] = useState<string>("");
    const [is_promo_open, setIsPromoOpen] = useState(false);
    const [selected_groups, setSelectedGroups] = useState<string[]>([]);
    const [is_group_open, setIsGroupOpen] = useState(false);
    const [selected_sub_group, setSelectedSubGroup] = useState<number>(0);
    const [selected_category, setSelectedCategory] = useState<string>("");
    const [is_category_open, setIsCategoryOpen] = useState(false);
    const [selected_cour, setSelectedCour] = useState<string>("");
    const [is_cour_open, setIsCourOpen] = useState(false);
    const [search_query, setSearchQuery] = useState("");
    const [professor_search_query, setProfessorSearchQuery] = useState("");
    const [promo_search_query, setPromoSearchQuery] = useState("");
    const [group_search_query, setGroupSearchQuery] = useState("");
    const [category_search_query, setCategorySearchQuery] = useState("");
    const [cour_search_query, setCourSearchQuery] = useState("");
    const search_input_ref = useRef<HTMLInputElement>(null);
    const professor_search_input_ref = useRef<HTMLInputElement>(null);
    const promo_search_input_ref = useRef<HTMLInputElement>(null);
    const group_search_input_ref = useRef<HTMLInputElement>(null);
    const category_search_input_ref = useRef<HTMLInputElement>(null);
    const cour_search_input_ref = useRef<HTMLInputElement>(null);
    const [selected_date, setSelectedDate] = useState<Date | undefined>(new Date());
    const [is_calendar_open, setIsCalendarOpen] = useState(false);
    const [start_time, setStartTime] = useState("09:00");
    const [end_time, setEndTime] = useState("10:00");
    const [is_submitting, setIsSubmitting] = useState(false);

    // Fetch rooms, buildings, promos, lesson types, and teachers from API
    useEffect(() => {
        async function fetchData() {
            if (!isopen) return;

            try {
                setIsLoadingLocations(true);
                setIsLoadingTeachers(true);
                setIsLoadingPromos(true);
                setIsLoadingLessonTypes(true);
                setIsLoadingLessons(true);

                const [rooms, buildings_data, all_groups, lesson_types_data, lessons_data, teachers_data] = await Promise.all([
                    getAllRooms(token.current),
                    getAllBuildings(token.current),
                    getAllGroups(token.current),
                    getLessonType(token.current),
                    getLessons(token.current),
                    getAllTeachers(token.current),
                ]);

                // Format locations with building names
                const formatted_locations = rooms.map((room: Location) => {
                    const building = buildings_data.find((b) => { return b.id === room.building_id; });
                    const display_name = building ? `${building.name} - ${room.name}` : room.name;

                    return {
                        value: room.id.toString(),
                        label: display_name,
                    };
                });

                setLocations(formatted_locations);
                setIsLoadingLocations(false);

                // Store all groups with their parent information
                const formatted_groups = all_groups.map((group) => {
                    return {
                        value    : group.id.toString(),
                        label    : group.name,
                        parent_id: group.parentId,
                    };
                });

                setAllGroups(formatted_groups);

                // Filter groups with parentId = 0 to get promos
                const promo_groups = all_groups.filter((group) => { return group.parentId === 0; });
                const formatted_promos = promo_groups.map((group) => {
                    return {
                        value: group.id.toString(),
                        label: group.name,
                    };
                });

                setPromos(formatted_promos);
                setIsLoadingPromos(false);

                // Format lesson types
                const formatted_lesson_types = lesson_types_data.map((lesson_type) => {
                    return {
                        value: lesson_type.id.toString(),
                        label: lesson_type.name,
                    };
                });

                setLessonTypes(formatted_lesson_types);
                setIsLoadingLessonTypes(false);

                // Format lessons
                const formatted_lessons = lessons_data.map((lesson: Lesson) => {
                    return {
                        value: lesson.id.toString(),
                        label: lesson.name,
                    };
                });

                setLessons(formatted_lessons);
                setIsLoadingLessons(false);

                // Format teachers
                const formatted_teachers = teachers_data.map((teacher: User) => {
                    const display_name = `${teacher.firstname} ${teacher.lastname}`;

                    return {
                        value: teacher.id.toString(),
                        label: display_name,
                    };
                });

                setTeachers(formatted_teachers);
                setIsLoadingTeachers(false);
            }
            catch(error) {
                console.error("Error fetching data:", error);
                setLocations([]);
                setIsLoadingLocations(false);
                setTeachers([]);
                setIsLoadingTeachers(false);
                setPromos([]);
                setIsLoadingPromos(false);
                setAllGroups([]);
                setLessonTypes([]);
                setIsLoadingLessonTypes(false);
                setLessons([]);
                setIsLoadingLessons(false);
            }
        }

        void fetchData();
    }, [isopen, token]);

    const filtered_locations = useMemo(() => {
        if (!search_query) return locations;

        return locations.filter((location) => {
            return location.label.toLowerCase().includes(search_query.toLowerCase());
        });
    }, [search_query, locations]);

    const filtered_professors = useMemo(() => {
        if (!professor_search_query) return teachers;

        return teachers.filter((professor) => {
            return professor.label.toLowerCase().includes(professor_search_query.toLowerCase());
        });
    }, [professor_search_query, teachers]);

    const filtered_promos = useMemo(() => {
        if (!promo_search_query) return promos;

        return promos.filter((promo) => {
            return promo.label.toLowerCase().includes(promo_search_query.toLowerCase());
        });
    }, [promo_search_query, promos]);

    const filtered_groups = useMemo(() => {
        // Filter groups based on selected promo
        const groups_for_promo = selected_promo
            ? all_groups.filter((group) => { return group.parent_id === parseInt(selected_promo, 10); })
            : [];

        // Apply search filter
        if (!group_search_query) return groups_for_promo;

        return groups_for_promo.filter((group) => {
            return group.label.toLowerCase().includes(group_search_query.toLowerCase());
        });
    }, [group_search_query, selected_promo, all_groups]);

    const filtered_categories = useMemo(() => {
        if (!category_search_query) return lesson_types;

        return lesson_types.filter((category) => {
            return category.label.toLowerCase().includes(category_search_query.toLowerCase());
        });
    }, [category_search_query, lesson_types]);

    const filtered_cours = useMemo(() => {
        if (!cour_search_query) return lessons;

        return lessons.filter((cour) => {
            return cour.label.toLowerCase().includes(cour_search_query.toLowerCase());
        });
    }, [cour_search_query, lessons]);

    const toggleLocation = (value: string) => {
        setSelectedLocations((prev) => {
            return prev.includes(value)
                ? prev.filter((loc) => { return loc !== value; })
                : [...prev, value];
        });
    };

    const toggleProfessor = (value: string) => {
        setSelectedProfessors((prev) => {
            return prev.includes(value)
                ? prev.filter((prof) => { return prof !== value; })
                : [...prev, value];
        });
    };

    const selectPromo = (value: string) => {
        setSelectedPromo(value);
        setIsPromoOpen(false);
    };

    const toggleGroup = (value: string) => {
        setSelectedGroups((prev) => {
            return prev.includes(value)
                ? prev.filter((grp) => { return grp !== value; })
                : [...prev, value];
        });
    };

    const selectCategory = (value: string) => {
        setSelectedCategory(value);
        setIsCategoryOpen(false);
    };

    const selectCour = (value: string) => {
        setSelectedCour(value);
        setIsCourOpen(false);
    };

    // Clear selected groups when promo changes
    useEffect(() => {
        setSelectedGroups([]);
    }, [selected_promo]);

    useEffect(() => {
        if (is_location_open && search_input_ref.current) {
            search_input_ref.current.focus();
        }
        else {
            setSearchQuery("");
        }
    }, [is_location_open]);

    useEffect(() => {
        if (is_professor_open && professor_search_input_ref.current) {
            professor_search_input_ref.current.focus();
        }
        else {
            setProfessorSearchQuery("");
        }
    }, [is_professor_open]);

    useEffect(() => {
        if (is_promo_open && promo_search_input_ref.current) {
            promo_search_input_ref.current.focus();
        }
        else {
            setPromoSearchQuery("");
        }
    }, [is_promo_open]);

    useEffect(() => {
        if (is_group_open && group_search_input_ref.current) {
            group_search_input_ref.current.focus();
        }
        else {
            setGroupSearchQuery("");
        }
    }, [is_group_open]);

    useEffect(() => {
        if (is_category_open && category_search_input_ref.current) {
            category_search_input_ref.current.focus();
        }
        else {
            setCategorySearchQuery("");
        }
    }, [is_category_open]);

    useEffect(() => {
        if (is_cour_open && cour_search_input_ref.current) {
            cour_search_input_ref.current.focus();
        }
        else {
            setCourSearchQuery("");
        }
    }, [is_cour_open]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (is_location_open && !target.closest(".location-select-container")) {
                setIsLocationOpen(false);
            }

            if (is_professor_open && !target.closest(".professor-select-container")) {
                setIsProfessorOpen(false);
            }

            if (is_promo_open && !target.closest(".promo-select-container")) {
                setIsPromoOpen(false);
            }

            if (is_group_open && !target.closest(".group-select-container")) {
                setIsGroupOpen(false);
            }

            if (is_category_open && !target.closest(".category-select-container")) {
                setIsCategoryOpen(false);
            }

            if (is_cour_open && !target.closest(".cour-select-container")) {
                setIsCourOpen(false);
            }

            if (is_calendar_open && !target.closest(".calendar-select-container")) {
                setIsCalendarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [is_location_open, is_professor_open, is_promo_open, is_group_open, is_category_open, is_cour_open, is_calendar_open]);

    const getLocationsDisplayText = () => {
        if (is_loading_locations) return "Chargement...";

        if (selected_locations.length === 0) return "Sélectionner un ou plusieurs lieux";

        if (selected_locations.length === 1) {
            const location = locations.find((loc) => { return loc.value === selected_locations[0]; });

            return location?.label ?? selected_locations[0];
        }

        return `${String(selected_locations.length)} lieux sélectionnés`;
    };

    const getProfessorsDisplayText = () => {
        if (is_loading_teachers) return "Chargement...";

        if (selected_professors.length === 0) return "Sélectionner un ou plusieurs professeurs";

        if (selected_professors.length === 1) {
            const professor = teachers.find((prof) => { return prof.value === selected_professors[0]; });

            return professor?.label ?? selected_professors[0];
        }

        return `${String(selected_professors.length)} professeurs sélectionnés`;
    };

    const getPromoDisplayText = () => {
        if (is_loading_promos) return "Chargement...";

        if (!selected_promo) return "Sélectionner une promo";

        const promo = promos.find((p) => { return p.value === selected_promo; });

        return promo?.label ?? selected_promo;
    };

    const getGroupsDisplayText = () => {
        if (!selected_promo) return "Sélectionner d'abord une promo";

        if (selected_groups.length === 0) return "Sélectionner un ou plusieurs groupes";

        if (selected_groups.length === 1) {
            const group = all_groups.find((grp) => { return grp.value === selected_groups[0]; });

            return group?.label ?? selected_groups[0];
        }

        return `${String(selected_groups.length)} groupes sélectionnés`;
    };

    const getCategoryDisplayText = () => {
        if (is_loading_lesson_types) return "Chargement...";

        if (!selected_category) return "Sélectionner une catégorie";

        const category = lesson_types.find((cat) => { return cat.value === selected_category; });

        return category?.label ?? selected_category;
    };

    const getCourDisplayText = () => {
        if (is_loading_lessons) return "Chargement...";

        if (!selected_cour) return "Sélectionner un cours";

        const cour = lessons.find((c) => { return c.value === selected_cour; });

        return cour?.label ?? selected_cour;
    };

    const formatDate = (date: Date | undefined) => {
        if (!date) return "Sélectionner une date";

        return date.toLocaleDateString("fr-FR", {
            day  : "numeric",
            month: "long",
            year : "numeric",
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!selected_date || !selected_cour || !selected_category || selected_groups.length === 0) {
            console.error("Missing required fields");

            return;
        }

        setIsSubmitting(true);

        // Execute async operation
        void (async () => {
            try {
                // Combine date and time into ISO strings
                const start_date = new Date(selected_date);
                const [start_hours, start_minutes] = start_time.split(":").map(Number);

                start_date.setHours(start_hours ?? 0, start_minutes ?? 0, 0, 0);

                const end_date = new Date(selected_date);
                const [end_hours, end_minutes] = end_time.split(":").map(Number);

                end_date.setHours(end_hours ?? 0, end_minutes ?? 0, 0, 0);

                // Step 1: Create the event
                const created_event = await setNewEvent(token.current, {
                    lesson_arg    : selected_sub_group,
                    lesson_type_id: parseInt(selected_category, 10),
                    lesson_id     : parseInt(selected_cour, 10),
                    start         : start_date,
                    end           : end_date,
                });

                console.log("Event created:", created_event);

                // Step 2: Link lesson to all selected groups
                const group_promises = selected_groups.map(async (group_id) => {
                    return linkLessonToGroup(token.current, parseInt(selected_cour, 10), {
                        group_id      : parseInt(group_id, 10),
                        lesson_args   : selected_sub_group,
                        lesson_type_id: parseInt(selected_category, 10),
                        lesson_id     : parseInt(selected_cour, 10),
                    });
                });

                await Promise.all(group_promises);
                console.log("Linked to groups");

                // Step 3: Link all selected rooms to the event
                console.log("Linking rooms:", selected_locations, "to event:", created_event.id);
                const room_promises = selected_locations.map(async (room_id) => {
                    console.log(`Linking room ${room_id} to event ${created_event.id}`);

                    return linkRoomToEvent(token.current, parseInt(created_event.id, 10), parseInt(room_id, 10));
                });

                await Promise.all(room_promises);
                console.log("Linked to rooms");

                // Step 4: Link all selected teachers to the event
                const teacher_promises = selected_professors.map(async (teacher_id) => {
                    return linkTeacherToEvent(token.current, parseInt(created_event.id, 10), parseInt(teacher_id, 10));
                });

                await Promise.all(teacher_promises);
                console.log("Linked to teachers");

                console.log("Event created successfully!");
                onClose();
            }
            catch(error) {
                console.error("Error creating event:", error);

                // TODO: Show error message to user
            }
            finally {
                setIsSubmitting(false);
            }
        })();
    };

    return (
        <Dialog open={isopen} onOpenChange={onClose}>
            <DialogContent className="event-dialog max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>

                    <DialogTitle>Nouvel Evenement</DialogTitle>

                    <DialogDescription>
                        Remplissez les détails pour créer un nouvel événement
                    </DialogDescription>

                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="space-y-2">
                        <Label>Date de l'événement</Label>

                        <div className="relative calendar-select-container">
                            <button
                                type="button"
                                onClick={() => { setIsCalendarOpen(!is_calendar_open); }}
                                className={cn(
                                    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md",
                                    "border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
                                    "ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring",
                                )}
                            >
                                <span className={cn(
                                    "line-clamp-1",
                                    !selected_date && "text-muted-foreground",
                                )}
                                >
                                    {formatDate(selected_date)}
                                </span>

                                <CalendarIcon className="h-4 w-4 opacity-50" />
                            </button>

                            {is_calendar_open && (
                                <div
                                    className={cn(
                                        "w-75 flex items-start justify-center",
                                        "absolute z-50 mt-1 rounded-md border",
                                        "bg-popover text-popover-foreground shadow-md",
                                        "animate-in fade-in-0 zoom-in-95 ",
                                    )}
                                >
                                    <Calendar
                                        mode="single"
                                        selected={selected_date}
                                        onSelect={(date) => {
                                            setSelectedDate(date);
                                            setIsCalendarOpen(false);
                                        }}
                                        className="w-full max-w-sm rounded-lg border shadow-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="start-time">Heure de début</Label>

                            <Input
                                id="start-time"
                                type="time"
                                value={start_time}
                                onChange={(e) => { setStartTime(e.target.value); }}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end-time">Heure de fin</Label>

                            <Input
                                id="end-time"
                                type="time"
                                value={end_time}
                                onChange={(e) => { setEndTime(e.target.value); }}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Promo</Label>

                        <div className="relative promo-select-container">
                            <button
                                type="button"
                                onClick={() => { setIsPromoOpen(!is_promo_open); }}
                                className={cn(
                                    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md",
                                    "border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
                                    "ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring",
                                    "disabled:cursor-not-allowed disabled:opacity-50",
                                )}
                            >
                                <span className={cn(
                                    "line-clamp-1",
                                    !selected_promo && "text-muted-foreground",
                                )}
                                >
                                    {getPromoDisplayText()}
                                </span>

                                <svg
                                    className="h-4 w-4 opacity-50"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {is_promo_open && (
                                <div
                                    className={cn(
                                        "absolute z-50 mt-1 w-full rounded-md border",
                                        "bg-popover text-popover-foreground shadow-md",
                                        "animate-in fade-in-0 zoom-in-95",
                                    )}
                                >
                                    <div className="p-2 border-b">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />

                                            <input
                                                ref={promo_search_input_ref}
                                                type="text"
                                                value={promo_search_query}
                                                onChange={(e) => { setPromoSearchQuery(e.target.value); }}
                                                placeholder="Rechercher une promo..."
                                                className={cn(
                                                    "w-full h-9 pl-8 pr-3 rounded-md border border-input",
                                                    "bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring",
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-1 max-h-[300px] overflow-y-auto">
                                        {filtered_promos.length === 0
                                            ? (
                                                <div className="py-6 text-center text-sm text-muted-foreground">
                                                    Aucune promo trouvée
                                                </div>
                                            )
                                            : filtered_promos.map((promo) => {
                                                return (
                                                    <div
                                                        key={promo.value}
                                                        onClick={() => { selectPromo(promo.value); }}
                                                        className={cn(
                                                            "relative flex w-full cursor-pointer select-none items-center",
                                                            "rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
                                                            "hover:bg-accent hover:text-accent-foreground",
                                                        )}
                                                    >
                                                        <span className="flex-1">{promo.label}</span>

                                                        {selected_promo === promo.value && (
                                                            <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                                                <Check className="h-4 w-4" />
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Groupe</Label>

                        <div className="relative group-select-container">
                            <button
                                type="button"
                                onClick={() => { setIsGroupOpen(!is_group_open); }}
                                className={cn(
                                    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md",
                                    "border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
                                    "ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring",
                                    "disabled:cursor-not-allowed disabled:opacity-50",
                                )}
                            >
                                <span className={cn(
                                    "line-clamp-1",
                                    selected_groups.length === 0 && "text-muted-foreground",
                                )}
                                >
                                    {getGroupsDisplayText()}
                                </span>

                                <svg
                                    className="h-4 w-4 opacity-50"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {is_group_open && (
                                <div
                                    className={cn(
                                        "absolute z-50 mt-1 w-full rounded-md border",
                                        "bg-popover text-popover-foreground shadow-md",
                                        "animate-in fade-in-0 zoom-in-95",
                                    )}
                                >
                                    <div className="p-2 border-b">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />

                                            <input
                                                ref={group_search_input_ref}
                                                type="text"
                                                value={group_search_query}
                                                onChange={(e) => { setGroupSearchQuery(e.target.value); }}
                                                placeholder="Rechercher un groupe..."
                                                className={cn(
                                                    "w-full h-9 pl-8 pr-3 rounded-md border border-input",
                                                    "bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring",
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-1 max-h-[300px] overflow-y-auto">
                                        {filtered_groups.length === 0
                                            ? (
                                                <div className="py-6 text-center text-sm text-muted-foreground">
                                                    Aucun groupe trouvé
                                                </div>
                                            )
                                            : filtered_groups.map((group) => {
                                                return (
                                                    <div
                                                        key={group.value}
                                                        onClick={() => { toggleGroup(group.value); }}
                                                        className={cn(
                                                            "relative flex w-full cursor-pointer select-none items-center",
                                                            "rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
                                                            "hover:bg-accent hover:text-accent-foreground",
                                                        )}
                                                    >
                                                        <span className="flex-1">{group.label}</span>

                                                        {selected_groups.includes(group.value) && (
                                                            <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                                                <Check className="h-4 w-4" />
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Sous Groupe</Label>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => { setSelectedSubGroup(0); }}
                                className={cn(
                                    "flex-1 h-9 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    "border border-input",
                                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                    selected_sub_group === 0
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-transparent hover:bg-accent hover:text-accent-foreground",
                                )}
                            >
                                Classe entière
                            </button>

                            <button
                                type="button"
                                onClick={() => { setSelectedSubGroup(1); }}
                                className={cn(
                                    "flex-1 h-9 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    "border border-input",
                                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                    selected_sub_group === 1
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-transparent hover:bg-accent hover:text-accent-foreground",
                                )}
                            >
                                Groupe A
                            </button>

                            <button
                                type="button"
                                onClick={() => { setSelectedSubGroup(2); }}
                                className={cn(
                                    "flex-1 h-9 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    "border border-input",
                                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                    selected_sub_group === 2
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-transparent hover:bg-accent hover:text-accent-foreground",
                                )}
                            >
                                Groupe B
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Type de leçon</Label>

                        <div className="relative category-select-container">
                            <button
                                type="button"
                                onClick={() => { setIsCategoryOpen(!is_category_open); }}
                                className={cn(
                                    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md",
                                    "border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
                                    "ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring",
                                    "disabled:cursor-not-allowed disabled:opacity-50",
                                )}
                            >
                                <span className={cn(
                                    "line-clamp-1",
                                    !selected_category && "text-muted-foreground",
                                )}
                                >
                                    {getCategoryDisplayText()}
                                </span>

                                <svg
                                    className="h-4 w-4 opacity-50"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {is_category_open && (
                                <div
                                    className={cn(
                                        "absolute z-50 mt-1 w-full rounded-md border",
                                        "bg-popover text-popover-foreground shadow-md",
                                        "animate-in fade-in-0 zoom-in-95",
                                    )}
                                >
                                    <div className="p-2 border-b">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />

                                            <input
                                                ref={category_search_input_ref}
                                                type="text"
                                                value={category_search_query}
                                                onChange={(e) => { setCategorySearchQuery(e.target.value); }}
                                                placeholder="Rechercher une catégorie..."
                                                className={cn(
                                                    "w-full h-9 pl-8 pr-3 rounded-md border border-input",
                                                    "bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring",
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-1 max-h-[300px] overflow-y-auto">
                                        {filtered_categories.length === 0
                                            ? (
                                                <div className="py-6 text-center text-sm text-muted-foreground">
                                                    Aucune catégorie trouvée
                                                </div>
                                            )
                                            : filtered_categories.map((category) => {
                                                return (
                                                    <div
                                                        key={category.value}
                                                        onClick={() => { selectCategory(category.value); }}
                                                        className={cn(
                                                            "relative flex w-full cursor-pointer select-none items-center",
                                                            "rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
                                                            "hover:bg-accent hover:text-accent-foreground",
                                                        )}
                                                    >
                                                        <span className="flex-1">{category.label}</span>

                                                        {selected_category === category.value && (
                                                            <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                                                <Check className="h-4 w-4" />
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Cours</Label>

                        <div className="relative cour-select-container">
                            <button
                                type="button"
                                onClick={() => { setIsCourOpen(!is_cour_open); }}
                                className={cn(
                                    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md",
                                    "border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
                                    "ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring",
                                    "disabled:cursor-not-allowed disabled:opacity-50",
                                )}
                            >
                                <span className={cn(
                                    "line-clamp-1",
                                    !selected_cour && "text-muted-foreground",
                                )}
                                >
                                    {getCourDisplayText()}
                                </span>

                                <svg
                                    className="h-4 w-4 opacity-50"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {is_cour_open && (
                                <div
                                    className={cn(
                                        "absolute z-50 mt-1 w-full rounded-md border",
                                        "bg-popover text-popover-foreground shadow-md",
                                        "animate-in fade-in-0 zoom-in-95",
                                    )}
                                >
                                    <div className="p-2 border-b">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />

                                            <input
                                                ref={cour_search_input_ref}
                                                type="text"
                                                value={cour_search_query}
                                                onChange={(e) => { setCourSearchQuery(e.target.value); }}
                                                placeholder="Rechercher un cours..."
                                                className={cn(
                                                    "w-full h-9 pl-8 pr-3 rounded-md border border-input",
                                                    "bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring",
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-1 max-h-[300px] overflow-y-auto">
                                        {filtered_cours.length === 0
                                            ? (
                                                <div className="py-6 text-center text-sm text-muted-foreground">
                                                    Aucun cours trouvé
                                                </div>
                                            )
                                            : filtered_cours.map((cour) => {
                                                return (
                                                    <div
                                                        key={cour.value}
                                                        onClick={() => { selectCour(cour.value); }}
                                                        className={cn(
                                                            "relative flex w-full cursor-pointer select-none items-center",
                                                            "rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
                                                            "hover:bg-accent hover:text-accent-foreground",
                                                        )}
                                                    >
                                                        <span className="flex-1">{cour.label}</span>

                                                        {selected_cour === cour.value && (
                                                            <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                                                <Check className="h-4 w-4" />
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="event-description">Lieu</Label>

                        <div className="relative location-select-container">
                            <button
                                type="button"
                                onClick={() => { setIsLocationOpen(!is_location_open); }}
                                className={cn(
                                    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md",
                                    "border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
                                    "ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring",
                                    "disabled:cursor-not-allowed disabled:opacity-50",
                                )}
                            >
                                <span className={cn(
                                    "line-clamp-1",
                                    selected_locations.length === 0 && "text-muted-foreground",
                                )}
                                >
                                    {getLocationsDisplayText()}
                                </span>

                                <svg
                                    className="h-4 w-4 opacity-50"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {is_location_open && (
                                <div
                                    className={cn(
                                        "absolute z-50 mt-1 w-full rounded-md border",
                                        "bg-popover text-popover-foreground shadow-md",
                                        "animate-in fade-in-0 zoom-in-95",
                                    )}
                                >
                                    <div className="p-2 border-b">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />

                                            <input
                                                ref={search_input_ref}
                                                type="text"
                                                value={search_query}
                                                onChange={(e) => { setSearchQuery(e.target.value); }}
                                                placeholder="Rechercher un lieu..."
                                                className={cn(
                                                    "w-full h-9 pl-8 pr-3 rounded-md border border-input",
                                                    "bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring",
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-1 max-h-[300px] overflow-y-auto">
                                        {filtered_locations.length === 0
                                            ? (
                                                <div className="py-6 text-center text-sm text-muted-foreground">
                                                    Aucun lieu trouvé
                                                </div>
                                            )
                                            : filtered_locations.map((location) => {
                                                return (
                                                    <div
                                                        key={location.value}
                                                        onClick={() => { toggleLocation(location.value); }}
                                                        className={cn(
                                                            "relative flex w-full cursor-pointer select-none items-center",
                                                            "rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
                                                            "hover:bg-accent hover:text-accent-foreground",
                                                        )}
                                                    >
                                                        <span className="flex-1">{location.label}</span>

                                                        {selected_locations.includes(location.value) && (
                                                            <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                                                <Check className="h-4 w-4" />
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Professeur</Label>

                        <div className="relative professor-select-container">
                            <button
                                type="button"
                                onClick={() => { setIsProfessorOpen(!is_professor_open); }}
                                className={cn(
                                    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md",
                                    "border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
                                    "ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring",
                                    "disabled:cursor-not-allowed disabled:opacity-50",
                                )}
                            >
                                <span className={cn(
                                    "line-clamp-1",
                                    selected_professors.length === 0 && "text-muted-foreground",
                                )}
                                >
                                    {getProfessorsDisplayText()}
                                </span>

                                <svg
                                    className="h-4 w-4 opacity-50"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {is_professor_open && (
                                <div
                                    className={cn(
                                        "absolute z-50 mt-1 w-full rounded-md border",
                                        "bg-popover text-popover-foreground shadow-md",
                                        "animate-in fade-in-0 zoom-in-95",
                                    )}
                                >
                                    <div className="p-2 border-b">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />

                                            <input
                                                ref={professor_search_input_ref}
                                                type="text"
                                                value={professor_search_query}
                                                onChange={(e) => { setProfessorSearchQuery(e.target.value); }}
                                                placeholder="Rechercher un professeur..."
                                                className={cn(
                                                    "w-full h-9 pl-8 pr-3 rounded-md border border-input",
                                                    "bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring",
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-1 max-h-[300px] overflow-y-auto">
                                        {filtered_professors.length === 0
                                            ? (
                                                <div className="py-6 text-center text-sm text-muted-foreground">
                                                    Aucun professeur trouvé
                                                </div>
                                            )
                                            : filtered_professors.map((professor) => {
                                                return (
                                                    <div
                                                        key={professor.value}
                                                        onClick={() => { toggleProfessor(professor.value); }}
                                                        className={cn(
                                                            "relative flex w-full cursor-pointer select-none items-center",
                                                            "rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
                                                            "hover:bg-accent hover:text-accent-foreground",
                                                        )}
                                                    >
                                                        <span className="flex-1">{professor.label}</span>

                                                        {selected_professors.includes(professor.value) && (
                                                            <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                                                <Check className="h-4 w-4" />
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="pt-4 gap-3">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="w-full sm:w-auto" disabled={is_submitting}>
                                Annuler
                            </Button>
                        </DialogClose>

                        <Button type="submit" className="w-full sm:w-auto" disabled={is_submitting}>
                            {is_submitting ? "Création en cours..." : "Valider"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
