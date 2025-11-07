"use client";

import { Calendar } from "#/components/ui/calendar";
import { useGeneralVars } from "@/shared/contexts/common/general.context";

import "@/ui/components/home/sidebar/daySelector/daySelector.component.css";

export const DaySelectorComp = () => {
    const { selecteddate } = useGeneralVars();

    return (
        <div className="w-full flex items-start justify-center px-4 pt-2 pb-2">
            <Calendar
                mode="single"
                selected={selecteddate.current}
                onSelect={(date) => { selecteddate.current = date; }}
                className="w-full max-w-sm rounded-lg border shadow-md"
                captionLayout="dropdown"
                startMonth={new Date(new Date().getFullYear(), new Date().getMonth() - (12 * 1), 0)}
                endMonth={new Date(new Date().getFullYear(), new Date().getMonth() + (12 * 10), 0)}
            />
        </div>
    );
};
