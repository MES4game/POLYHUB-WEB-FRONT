"use client";

import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select";

import "@/ui/components/home/sidebar/filters/filtersSelect.component.css";

export const FiltersSelectComp = () => {
    const [selected_category, setSelectedCategory] = React.useState<string>("");
    const [selected_location, setSelectedLocation] = React.useState<string>("");

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

                <Select value={selected_location} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un groupe" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="sport">Groupe1</SelectItem>
                        <SelectItem value="culture">Groupe2</SelectItem>
                        {/* Groupes sur appel backend */}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
