"use client";

import * as React from "react";

import { Calendar } from "#/components/ui/calendar";

import "@/ui/components/home/sidebar/daySelector/daySelector.component.css";

export const DaySelectorComp = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
        <div className="w-full flex items-start justify-center px-4 pt-2 pb-2">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full max-w-sm rounded-lg border shadow-md"
                captionLayout="dropdown"
                startMonth={new Date(new Date().getFullYear(), new Date().getMonth() - (12 * 1), 0)}
                endMonth={new Date(new Date().getFullYear(), new Date().getMonth() + (12 * 10), 0)}
            />
        </div>
    );
};
