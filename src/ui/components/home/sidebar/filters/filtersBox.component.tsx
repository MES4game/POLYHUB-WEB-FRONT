"use client";

import * as React from "react";
import { BoxHeaderComp } from "./boxHeader.component";
import { FiltersSelectComp } from "./filtersSelect.component";
import { FiltersEventComp } from "./filtersEvent.component";
import { EventModel } from "@/shared/models/event.model";

import "@/ui/components/home/sidebar/filters/filtersBox.component.css";

type HeaderView = "events" | "filters";

export const FiltersBoxComp = () => {
    const [active_view, setActiveView] = React.useState<HeaderView>("events");
    
    const formatCurrentDate = (): string => {
        const today = new Date();
        
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year   : "numeric",
            month  : "long",
            day    : "numeric",
        };
        
        return today.toLocaleDateString("fr-FR", options);
    };

    // Mock data for demonstration - replace with actual data from your API
    const mock_events: EventModel[] = [
        {
            id          : "1",
            title       : "Mathématiques Avancées",
            start_time  : "08:00",
            end_time    : "10:00",
            location    : ["Salle A101"],
            professor   : ["Prof. Dubois"],
            category    : "Math",
            group       : [],
            color       : "blue",
            is_following: true,
        },
        {
            id          : "2",
            title       : "Programmation Web",
            start_time  : "10:15",
            end_time    : "12:15",
            location    : ["Salle B203"],
            professor   : ["Prof. Martin"],
            category    : "Informatique",
            group       : [],
            color       : "orange",
            is_following: false,
        },
    ];

    return (
        <div className="w-full h-full flex items-start justify-center px-4 pb-4 overflow-hidden">
            <div className="w-full max-w-sm h-full rounded-lg border shadow-md bg-white p-4 flex flex-col overflow-hidden">
                <BoxHeaderComp activeview={active_view} onViewChange={setActiveView} />
                
                {active_view === "events" && (
                    <p className="text-sm text-gray-500 mb-3 px-1">
                        {formatCurrentDate()}
                    </p>
                )}
                
                <div className="flex-1 overflow-y-auto event-container min-h-0">
                    {active_view === "events"
                        ? (
                            <div className="space-y-3 pr-1">
                                {mock_events.map((event) => { return <FiltersEventComp key={event.id} event={event} />; })}
                            </div>
                        )
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
