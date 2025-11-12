export interface EventModel {
    id          : string;
    title       : string;
    start_time  : string;
    end_time    : string;
    location    : string[];
    professor   : string[];
    category    : string;
    group       : string[];
    sub_group   : number;
    color       : EventColor;
    is_following: boolean;
}

export interface SubEvent {
    lesson_arg    : number;
    lesson_type_id: number;
    lesson_id     : number;
    end           : Date;
    start         : Date;
}

export interface SubEventReturn {
    id            : string;
    start         : Date;
    end           : Date;
    lesson_id     : number;
    lesson_type_id: number;
    lesson_arg    : number;
}


export type EventColor = "blue" | "orange" | "green" | "purple" | "red" | "yellow";

export const EVENT_COLOR_UTILS = {
    getCategoryColor: (color: EventColor): string => {
        const color_map: Record<EventColor, string> = {
            blue  : "bg-blue-500",
            orange: "bg-orange-500",
            green : "bg-green-500",
            purple: "bg-purple-500",
            red   : "bg-red-500",
            yellow: "bg-yellow-500",
        };

        return color_map[color];
    },

    getCategoryTextColor: (color: EventColor): string => {
        const color_map: Record<EventColor, string> = {
            blue  : "text-blue-600",
            orange: "text-orange-600",
            green : "text-green-600",
            purple: "text-purple-600",
            red   : "text-red-600",
            yellow: "text-yellow-600",
        };

        return color_map[color];
    },

    getCategoryBgColor: (color: EventColor): string => {
        const color_map: Record<EventColor, string> = {
            blue  : "bg-blue-50",
            orange: "bg-orange-50",
            green : "bg-green-50",
            purple: "bg-purple-50",
            red   : "bg-red-50",
            yellow: "bg-yellow-50",
        };

        return color_map[color];
    },
};
