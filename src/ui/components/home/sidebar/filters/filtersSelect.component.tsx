"use client";

import * as React from "react";
import { Check, Search, RotateCcw } from "lucide-react";
import { cn } from "#/lib/utils";
import { Button } from "#/components/ui/button";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import { useFilters } from "@/shared/contexts/common/filter.context";
import { getAllGroups } from "@/api/admin.api";
import { Group } from "@/shared/models/common/group.model";
import { useReRender } from "@/shared/utils/common/hook.util";

import "@/ui/components/home/sidebar/filters/filtersSelect.component.css";

interface GroupOption {
    value    : string;
    label    : string;
    parent_id: number | null;
}

export const FiltersSelectComp = () => {
    const { token } = useGeneralVars();
    const { selected_groups, applied_groups } = useFilters();
    const reRender = useReRender();

    const [selected_promo, setSelectedPromo] = React.useState<string>("");
    const [is_promo_open, setIsPromoOpen] = React.useState(false);
    const [is_group_open, setIsGroupOpen] = React.useState(false);
    const [promo_search_query, setPromoSearchQuery] = React.useState("");
    const [group_search_query, setGroupSearchQuery] = React.useState("");
    const [all_groups, setAllGroups] = React.useState<GroupOption[]>([]);
    const [promos, setPromos] = React.useState<GroupOption[]>([]);
    const [is_loading, setIsLoading] = React.useState(true);

    const promo_search_input_ref = React.useRef<HTMLInputElement>(null);
    const group_search_input_ref = React.useRef<HTMLInputElement>(null);

    // Fetch groups from API
    React.useEffect(() => {
        const fetchGroups = async () => {
            if (!token.current) {
                setIsLoading(false);

                return;
            }

            try {
                setIsLoading(true);
                const groups_data = await getAllGroups(token.current);

                // Format all groups
                const formatted_groups = groups_data.map((group: Group) => {
                    return {
                        value    : group.id.toString(),
                        label    : group.name,
                        parent_id: group.parentId,
                    };
                });

                setAllGroups(formatted_groups);

                // Filter promos (parentId = null or 0)
                const promo_groups = groups_data.filter((group: Group) => {
                    return group.parentId === null || group.parentId === 0;
                });

                const formatted_promos = promo_groups.map((group: Group) => {
                    return {
                        value    : group.id.toString(),
                        label    : group.name,
                        parent_id: group.parentId,
                    };
                });

                setPromos(formatted_promos);
            }
            catch(error) {
                console.error("Error fetching groups:", error);
                setAllGroups([]);
                setPromos([]);
            }
            finally {
                setIsLoading(false);
            }
        };

        void fetchGroups();
    }, [token]);

    // Filter groups by promo
    const filtered_groups = React.useMemo(() => {
        const groups_for_promo = selected_promo
            ? all_groups.filter((group) => {
                return group.parent_id === parseInt(selected_promo, 10);
            })
            : [];

        if (!group_search_query) return groups_for_promo;

        return groups_for_promo.filter((group) => {
            return group.label.toLowerCase().includes(group_search_query.toLowerCase());
        });
    }, [group_search_query, selected_promo, all_groups]);

    // Filter promos by search query
    const filtered_promos = React.useMemo(() => {
        if (!promo_search_query) return promos;

        return promos.filter((promo) => {
            return promo.label.toLowerCase().includes(promo_search_query.toLowerCase());
        });
    }, [promo_search_query, promos]);

    const toggleGroup = (value: string) => {
        selected_groups.current = selected_groups.current.includes(value)
            ? selected_groups.current.filter((g) => { return g !== value; })
            : [...selected_groups.current, value];

        reRender();
    };

    const selectPromo = (value: string) => {
        setSelectedPromo(value);
        setIsPromoOpen(false);
    };

    const resetFilters = () => {
        selected_groups.current = [];
        applied_groups.current = [];
        setSelectedPromo("");
        reRender();
    };

    const applyFilters = () => {
        applied_groups.current = [...selected_groups.current];
        reRender();
    };

    // Clear selected groups when promo changes
    React.useEffect(() => {
        selected_groups.current = [];
        reRender();
    }, [selected_promo, selected_groups, reRender]);

    // Focus search input when promo dropdown opens
    React.useEffect(() => {
        if (is_promo_open && promo_search_input_ref.current) {
            promo_search_input_ref.current.focus();
        }
        else {
            setPromoSearchQuery("");
        }
    }, [is_promo_open]);

    // Focus search input when group dropdown opens
    React.useEffect(() => {
        if (is_group_open && group_search_input_ref.current) {
            group_search_input_ref.current.focus();
        }
        else {
            setGroupSearchQuery("");
        }
    }, [is_group_open]);

    // Close dropdowns when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (is_promo_open && !target.closest(".promo-select-container")) {
                setIsPromoOpen(false);
            }

            if (is_group_open && !target.closest(".group-select-container")) {
                setIsGroupOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [is_promo_open, is_group_open]);

    const getPromoDisplayText = () => {
        if (is_loading) return "Chargement...";

        if (!selected_promo) return "Sélectionner une promo";

        const promo = promos.find((p) => { return p.value === selected_promo; });

        return promo?.label ?? selected_promo;
    };

    const getGroupsDisplayText = () => {
        if (!selected_promo) return "Sélectionner d'abord une promo";

        if (selected_groups.current.length === 0) return "Sélectionner des groupes";

        if (selected_groups.current.length === 1) {
            const group = all_groups.find((g) => { return g.value === selected_groups.current[0]; });

            return group?.label ?? selected_groups.current[0];
        }

        return `${String(selected_groups.current.length)} groupes sélectionnés`;
    };

    return (
        <div className="w-full space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Promo</label>

                <div className="relative promo-select-container">
                    <button
                        type="button"
                        onClick={() => { setIsPromoOpen(!is_promo_open); }}
                        disabled={is_loading}
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
                <label className="text-sm font-medium">Groupes</label>

                <div className="relative group-select-container">
                    <button
                        type="button"
                        onClick={() => { setIsGroupOpen(!is_group_open); }}
                        disabled={!selected_promo || is_loading}
                        className={cn(
                            "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md",
                            "border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
                            "ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                        )}
                    >
                        <span className={cn(
                            "line-clamp-1",
                            selected_groups.current.length === 0 && "text-muted-foreground",
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

                                                {selected_groups.current.includes(group.value) && (
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

            <div className="flex justify-between gap-2 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                    disabled={selected_groups.current.length === 0 && !selected_promo}
                    className="gap-2"
                >
                    <RotateCcw className="h-4 w-4" />
                    Réinitialiser
                </Button>

                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={applyFilters}
                    disabled={selected_groups.current.length === 0}
                    className="gap-2"
                >
                    <Check className="h-4 w-4" />
                    Appliquer
                </Button>
            </div>
        </div>
    );
};
