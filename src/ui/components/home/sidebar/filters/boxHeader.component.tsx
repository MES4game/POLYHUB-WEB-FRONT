"use client";

import * as React from "react";
import { Button } from "#/components/ui/button";

import "@/ui/components/home/sidebar/filters/boxHeader.component.css";

type HeaderView = "events" | "filters";

interface BoxHeaderProps {
    activeview  : HeaderView;
    onViewChange: (view: HeaderView) => void;
}

export const BoxHeaderComp: React.FC<BoxHeaderProps> = ({ activeview, onViewChange }) => {
    return (
        <div className="w-full flex gap-2 mb-4">
            <Button
                variant={activeview === "events" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => {
                    onViewChange("events");
                }}
            >
                Evenements
            </Button>

            <Button
                variant={activeview === "filters" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => {
                    onViewChange("filters");
                }}
            >
                Filtres
            </Button>
        </div>
    );
};
