import { FC, ReactNode, useEffect } from "react";
import "@/ui/pages/home/home.page.css";
import { Calendar } from "#/components/ui/calendar";
import React from "react";


const HomePage: FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: HomePage");
    }, []);

    useEffect(() => {
        console.log("Rendered: HomePage");
    });

    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border"
        />
    );
};

export default HomePage;
