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

import "./eventDialog.component.css";

interface EventDialogProps {
    isopen : boolean;
    onClose: () => void;
}

export const EventDialogComp: FC<EventDialogProps> = ({ isopen, onClose }): ReactNode => {
    const [selected_locations, setSelectedLocations] = useState<string[]>([]);
    const [is_location_open, setIsLocationOpen] = useState(false);
    const [selected_professors, setSelectedProfessors] = useState<string[]>([]);
    const [is_professor_open, setIsProfessorOpen] = useState(false);
    const [selected_promo, setSelectedPromo] = useState<string>("");
    const [is_promo_open, setIsPromoOpen] = useState(false);
    const [selected_groups, setSelectedGroups] = useState<string[]>([]);
    const [is_group_open, setIsGroupOpen] = useState(false);
    const [selected_category, setSelectedCategory] = useState<string>("");
    const [is_category_open, setIsCategoryOpen] = useState(false);
    const [search_query, setSearchQuery] = useState("");
    const [professor_search_query, setProfessorSearchQuery] = useState("");
    const [promo_search_query, setPromoSearchQuery] = useState("");
    const [group_search_query, setGroupSearchQuery] = useState("");
    const [category_search_query, setCategorySearchQuery] = useState("");
    const search_input_ref = useRef<HTMLInputElement>(null);
    const professor_search_input_ref = useRef<HTMLInputElement>(null);
    const promo_search_input_ref = useRef<HTMLInputElement>(null);
    const group_search_input_ref = useRef<HTMLInputElement>(null);
    const category_search_input_ref = useRef<HTMLInputElement>(null);
    const [selected_date, setSelectedDate] = useState<Date | undefined>(new Date());
    const [is_calendar_open, setIsCalendarOpen] = useState(false);
    const [start_time, setStartTime] = useState("09:00");
    const [end_time, setEndTime] = useState("10:00");
    const [selected_color, setSelectedColor] = useState("#3b82f6");

    const predefined_colors = [
        "#3b82f6",
        "#ef4444",
        "#10b981",
        "#f59e0b",
        "#8b5cf6",
        "#ec4899",
        "#06b6d4",
        "#f97316",
    ];

    const locations = [
        { value: "620 Amphi", label: "620 Amphi" },
        { value: "620 B120", label: "620 B120" },
    ];

    const professors = [
        { value: "prof1", label: "Joel GAY" },
        { value: "prof2", label: "Emmanuelle FRENOUX" },
    ];

    const promos = [
        { value: "promo1", label: "ET3" },
        { value: "promo2", label: "ET4" },
        { value: "promo3", label: "ET5" },
    ];

    const groups = [
        { value: "group1", label: "IIM - groupe 1" },
        { value: "group2", label: "IIM - groupe 2" },
        { value: "group3", label: "MTX - groupe 1" },
    ];

    const categories = [
        { value: "cat1", label: "Cours" },
        { value: "cat2", label: "TD" },
        { value: "cat3", label: "TP" },
        { value: "cat4", label: "Contrôle" },
    ];

    const filtered_locations = useMemo(() => {
        if (!search_query) return locations;

        return locations.filter((location) => {
            return location.label.toLowerCase().includes(search_query.toLowerCase());
        });
    }, [search_query, locations]);

    const filtered_professors = useMemo(() => {
        if (!professor_search_query) return professors;

        return professors.filter((professor) => {
            return professor.label.toLowerCase().includes(professor_search_query.toLowerCase());
        });
    }, [professor_search_query, professors]);

    const filtered_promos = useMemo(() => {
        if (!promo_search_query) return promos;

        return promos.filter((promo) => {
            return promo.label.toLowerCase().includes(promo_search_query.toLowerCase());
        });
    }, [promo_search_query, promos]);

    const filtered_groups = useMemo(() => {
        if (!group_search_query) return groups;

        return groups.filter((group) => {
            return group.label.toLowerCase().includes(group_search_query.toLowerCase());
        });
    }, [group_search_query, groups]);

    const filtered_categories = useMemo(() => {
        if (!category_search_query) return categories;

        return categories.filter((category) => {
            return category.label.toLowerCase().includes(category_search_query.toLowerCase());
        });
    }, [category_search_query, categories]);

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

            if (is_calendar_open && !target.closest(".calendar-select-container")) {
                setIsCalendarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [is_location_open, is_professor_open, is_promo_open, is_group_open, is_category_open, is_calendar_open]);

    const getLocationsDisplayText = () => {
        if (selected_locations.length === 0) return "Sélectionner un ou plusieurs lieux";

        if (selected_locations.length === 1) {
            const location = locations.find((loc) => { return loc.value === selected_locations[0]; });

            return location?.label ?? selected_locations[0];
        }

        return `${String(selected_locations.length)} lieux sélectionnés`;
    };

    const getProfessorsDisplayText = () => {
        if (selected_professors.length === 0) return "Sélectionner un ou plusieurs professeurs";

        if (selected_professors.length === 1) {
            const professor = professors.find((prof) => { return prof.value === selected_professors[0]; });

            return professor?.label ?? selected_professors[0];
        }

        return `${String(selected_professors.length)} professeurs sélectionnés`;
    };

    const getPromoDisplayText = () => {
        if (!selected_promo) return "Sélectionner une promo";

        const promo = promos.find((p) => { return p.value === selected_promo; });

        return promo?.label ?? selected_promo;
    };

    const getGroupsDisplayText = () => {
        if (selected_groups.length === 0) return "Sélectionner un ou plusieurs groupes";

        if (selected_groups.length === 1) {
            const group = groups.find((grp) => { return grp.value === selected_groups[0]; });

            return group?.label ?? selected_groups[0];
        }

        return `${String(selected_groups.length)} groupes sélectionnés`;
    };

    const getCategoryDisplayText = () => {
        if (!selected_category) return "Sélectionner une catégorie";

        const category = categories.find((cat) => { return cat.value === selected_category; });

        return category?.label ?? selected_category;
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


        // TODO: Handle form submission with all data
        console.log({
            locations : selected_locations,
            professors: selected_professors,
            promo     : selected_promo,
            groups    : selected_groups,
            category  : selected_category,
            date      : selected_date,
            start_time,
            end_time,
            color     : selected_color,
        });

        onClose();
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
                    {/* Event Title */}
                    <div className="space-y-2">
                        <Label htmlFor="event-title">Nom de l'événement</Label>

                        <Input
                            id="event-title"
                            placeholder="Entrez le nom de l'événement"
                            required
                        />
                    </div>

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
                        <Label>Catégorie</Label>

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
                        <Label>Couleur de l'événement</Label>

                        <div className="flex flex-wrap gap-2">
                            {predefined_colors.map((color) => {
                                return (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => { setSelectedColor(color); }}
                                        className={cn(
                                            "h-10 w-10 rounded-md transition-all hover:scale-110",
                                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                            selected_color === color && "ring-2 ring-ring ring-offset-2 scale-110",
                                        )}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    >
                                        {selected_color === color
                                            && <Check className="h-5 w-5 mx-auto text-white drop-shadow-md" />}
                                    </button>
                                );
                            })}

                            <div className="relative">
                                <input
                                    type="color"
                                    value={selected_color}
                                    onChange={(e) => { setSelectedColor(e.target.value); }}
                                    className="h-10 w-10 cursor-pointer rounded-md border border-input"
                                    title="Choisir une couleur personnalisée"
                                />
                            </div>
                        </div>
                    </div>


                    <DialogFooter className="pt-4 gap-3">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="w-full sm:w-auto">
                                Annuler
                            </Button>
                        </DialogClose>

                        <Button type="submit" className="w-full sm:w-auto">
                            Valider
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
