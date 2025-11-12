"use client";

import * as React from "react";
import { Card, CardContent } from "#/components/ui/card";
import { Clock, MapPin, Users, ChevronRight, UsersRound } from "lucide-react";
import { EventModel, EVENT_COLOR_UTILS } from "@/shared/models/event.model";

import "@/ui/components/home/sidebar/filters/filtersEvent.component.css";

interface FiltersEventProps {
    event: EventModel;
}

export const FiltersEventComp: React.FC<FiltersEventProps> = ({ event }) => {
    return (
        <Card className="event-card relative overflow-hidden transition-all hover:shadow-lg cursor-pointer">
            <div className={`absolute top-0 left-0 w-1 h-full ${EVENT_COLOR_UTILS.getCategoryColor(event.color)}`} />

            <CardContent className="p-4 pl-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${EVENT_COLOR_UTILS.getCategoryBgColor(event.color)} ${EVENT_COLOR_UTILS.getCategoryTextColor(event.color)}`}>
                        {event.category}
                    </span>

                    <button
                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                        aria-label="View event details"
                        onClick={(e) => {
                            e.stopPropagation();

                            // Handle event details view
                        }}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <h3 className="text-base font-semibold text-gray-900 mb-3">
                    {event.title}
                </h3>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 flex-shrink-0" />

                        <span>
                            {event.start_time} - {event.end_time}
                        </span>
                    </div>

                    {event.location.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 flex-shrink-0" />

                            <span className="truncate">
                                {event.location.join(", ")}
                            </span>
                        </div>
                    )}

                    {event.professor.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4 flex-shrink-0" />

                            <span className="truncate">
                                {event.professor.join(", ")}
                            </span>
                        </div>
                    )}

                    {event.group.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <UsersRound className="w-4 h-4 flex-shrink-0" />

                            <span className="truncate">
                                {event.group.join(", ")}
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
