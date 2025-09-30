"use client";

import * as React from "react";

import { Calendar } from "#/components/ui/calendar";

import "@/ui/components/sidebar/dayPicker/dayPicker.component.css";

export const CalendarDemoComp = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
        <Calendar
            id="calendar"
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm"
            captionLayout="dropdown"
        />
    );
};
