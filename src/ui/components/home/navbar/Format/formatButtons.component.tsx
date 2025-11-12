import { FC, ReactNode, useEffect, useState } from "react";
import { Button } from "#/components/ui/button";
import { ButtonGroup } from "#/components/ui/button-group";

export type CalendarFormat = "day" | "week" | "month";

interface FormatButtonsProps {
    value?        : CalendarFormat;
    onValueChange?: (value: CalendarFormat) => void;
    classname?    : string;
}

const FormatButtonsComp: FC<FormatButtonsProps> = ({
    value = "week",
    onValueChange,
    classname,
}): ReactNode => {
    const [selectedformat, setSelectedFormat] = useState<CalendarFormat>(value);

    useEffect(() => {
        console.log("Loaded: FormatButtonsComp");
    }, []);

    useEffect(() => {
        setSelectedFormat(value);
    }, [value]);

    const handleFormatChange = (format: CalendarFormat) => {
        setSelectedFormat(format);
        onValueChange?.(format);
    };

    const formats: { value: CalendarFormat; label: string; arialabel: string }[] = [
        { value: "day", label: "Day", arialabel: "View by day" },
        { value: "week", label: "Week", arialabel: "View by week" },
        { value: "month", label: "Month", arialabel: "View by month" },
    ];

    return (
        <ButtonGroup
            className={classname}
            orientation="horizontal"
            aria-label="Calendar format selector"
        >
            {formats.map(({ value: formatvalue, label, arialabel }) => {
                return (
                    <Button
                        key={formatvalue}
                        variant={selectedformat === formatvalue ? "default" : "outline"}
                        size="sm"
                        onClick={() => { handleFormatChange(formatvalue); }}
                        aria-pressed={selectedformat === formatvalue}
                        aria-label={arialabel}
                    >
                        {label}
                    </Button>
                );
            })}
        </ButtonGroup>
    );
};

export default FormatButtonsComp;
