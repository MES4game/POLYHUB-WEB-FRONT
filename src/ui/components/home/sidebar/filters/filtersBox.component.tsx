"use client";

import * as React from "react";
import { BoxHeaderComp } from "./boxHeader.component";
import { FiltersSelectComp } from "./filtersSelect.component";

import "@/ui/components/home/sidebar/filters/filtersBox.component.css";

type HeaderView = "events" | "filters";

export const FiltersBoxComp = () => {
    const [active_view, setActiveView] = React.useState<HeaderView>("events");

    return (
        <div className="w-full h-full flex-1 flex items-start justify-center px-4 pt-2 pb-4">
            <div className="w-full h-full max-w-sm rounded-lg border shadow-md bg-white p-4 flex flex-col">
                <BoxHeaderComp activeview={active_view} onViewChange={setActiveView} />
                
                <div className="w-full h-full overflow-y-auto">
                    {active_view === "events"
                        ? (
                            <div>
                                <p className="text-sm text-gray-500">Les événements du jour apparaîtront ici</p>
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
