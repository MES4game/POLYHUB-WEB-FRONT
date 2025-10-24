"use client";

import * as React from "react";

import { Calendar } from "#/components/ui/calendar";

import "@/ui/components/home/sidebar/daySelector/daySelector.component.css";

export const DaySelectorComp = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
        <div className="w-full h-full flex items-start justify-center p-4">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full max-w-sm rounded-lg border shadow-md"
                captionLayout="dropdown"
            />
        </div>
    );
};
