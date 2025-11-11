"use client";

import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select";
import { Check, Search } from "lucide-react";
import { cn } from "#/lib/utils";

import "@/ui/components/home/sidebar/filters/filtersSelect.component.css";

export const FiltersSelectComp = () => {
    const [selected_category, setSelectedCategory] = React.useState<string>("");
    const [selected_groups, setSelectedGroups] = React.useState<string[]>([]);
    const [is_group_open, setIsGroupOpen] = React.useState(false);
    const [search_query, setSearchQuery] = React.useState("");
    const search_input_ref = React.useRef<HTMLInputElement>(null);

    const groups = [
        { value: "groupe1", label: "Groupe1" },
        { value: "groupe2", label: "Groupe2" },

        // Groupes sur appel backend
    ];

    const filtered_groups = React.useMemo(() => {
        if (!search_query) return groups;

        return groups.filter((group) => {
            return group.label.toLowerCase().includes(search_query.toLowerCase());
        });
    }, [search_query, groups]);

    const toggleGroup = (value: string) => {
        setSelectedGroups((prev) => {
            return prev.includes(value)
                ? prev.filter((g) => { return g !== value; })
                : [...prev, value];
        });
    };

    // Focus search input when dropdown opens
    React.useEffect(() => {
        if (is_group_open && search_input_ref.current) {
            search_input_ref.current.focus();
        }
        else {
            setSearchQuery("");
        }
    }, [is_group_open]);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (is_group_open && !target.closest(".group-select-container")) {
                setIsGroupOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [is_group_open]);

    const getGroupsDisplayText = () => {
        if (selected_groups.length === 0) return "Sélectionner des groupes";

        if (selected_groups.length === 1) {
            const group = groups.find((g) => { return g.value === selected_groups[0]; });

            return group?.label ?? selected_groups[0];
        }

        return `${String(selected_groups.length)} groupes sélectionnés`;
    };

    return (
        <div className="w-full space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Promo</label>

                <Select value={selected_category} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner une promo" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="sport">Peip1</SelectItem>
                        <SelectItem value="culture">Peip2</SelectItem>
                        {/* Promo sur appel backend */}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Groupes</label>

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
                                        ref={search_input_ref}
                                        type="text"
                                        value={search_query}
                                        onChange={(e) => { setSearchQuery(e.target.value); }}
                                        placeholder="Rechercher..."
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
        </div>
    );
};
