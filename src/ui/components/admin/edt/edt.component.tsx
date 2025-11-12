import { FC, ReactNode, useEffect, useState } from "react";
import CalendarComp from "./calendar.component";
import { CalendarFormat } from "./formatButtons.component";
import FormatButtonsComp from "./formatButtons.component";
import EventButtonComp from "./eventButton.component";
import { DaySelectorComp } from "./daySelector.component";

const AdminEDTComp: FC = (): ReactNode => {
    const [calendarformat, setCalendarFormat] = useState<CalendarFormat>("week");

    useEffect(() => {
        console.log("Loaded: AdminEDTComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: AdminEDTComp");
    });

    const handleFormatChange = (format: CalendarFormat) => {
        setCalendarFormat(format);
    };

    return (
        <div className="flex flex-col h-full w-full">
            {/* Top bar with format buttons */}
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold">Emploi du Temps</h2>

                <FormatButtonsComp
                    value={calendarformat}
                    onValueChange={handleFormatChange}
                />
            </div>

            {/* Main content area with sidebar and calendar */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-80 border-r flex flex-col overflow-y-auto">
                    <EventButtonComp />
                    <DaySelectorComp />
                </div>

                {/* Calendar */}
                <div className="flex-1 overflow-y-auto">
                    <CalendarComp calendarformat={calendarformat} />
                </div>
            </div>
        </div>
    );
};

export default AdminEDTComp;
