"use client";

import * as React from "react";

import { Calendar } from "#/components/ui/calendar";

import "@/ui/components/home/sidebar/daySelector/daySelector.component.css";

export const DaySelectorComp = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
        <Calendar
            id="daySelector"
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm"
            captionLayout="dropdown"
        />
    );
};
