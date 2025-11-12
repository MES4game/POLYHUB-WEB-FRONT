import { FC, ReactNode, useEffect, useRef, useState } from "react";
import "@/ui/components/home/sidebar/sidebar.component.css";

import { DaySelectorComp } from "./daySelector/daySelector.component";
import { FiltersBoxComp } from "./filters/filtersBox.component";

const SidebarComp : FC = () : ReactNode => {
    const [min_filter_height, setMinFilterHeight] = useState<number>(200);
    const [filter_box_height, setFilterBoxHeight] = useState<number>(min_filter_height);
    const is_dragging_ref = useRef<boolean>(false);
    const start_y_ref = useRef<number>(0);
    const start_height_ref = useRef<number>(0);
    const sidebar_ref = useRef<HTMLDivElement>(null);
    const day_selector_ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("Loaded: NavbarComp");
    }, []);
    
    useEffect(() => {
        console.log("Rendered: NavbarComp");
    });

    useEffect(() => {
        const calculateMinHeight = () => {
            if (sidebar_ref.current && day_selector_ref.current) {
                const sidebar_height = sidebar_ref.current.clientHeight;
                const day_selector_bottom = day_selector_ref.current.offsetTop + day_selector_ref.current.clientHeight;
                const remaining_space = sidebar_height - day_selector_bottom;
                const new_min_height = Math.max(remaining_space, 100);
                setMinFilterHeight(new_min_height);
                
                // Always set height to min height (base height)
                setFilterBoxHeight(new_min_height);
            }
        };

        calculateMinHeight();
        window.addEventListener("resize", calculateMinHeight);

        return () => {
            window.removeEventListener("resize", calculateMinHeight);
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        is_dragging_ref.current = true;
        start_y_ref.current = e.clientY;
        start_height_ref.current = filter_box_height;
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!is_dragging_ref.current) return;
            
            const delta_y = start_y_ref.current - e.clientY;
            const new_height = Math.max(min_filter_height, Math.min(800, start_height_ref.current + delta_y));
            setFilterBoxHeight(new_height);
        };

        const handleMouseUp = () => {
            is_dragging_ref.current = false;
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [filter_box_height, min_filter_height]);

    return (
        <div id="sidebar" ref={sidebar_ref}>
            <div className="sidebar-content-wrapper">

                <div ref={day_selector_ref} className="day-selector-container">
                    <DaySelectorComp />
                </div>
            </div>

            <div
                className="filter-box-container"
                style={{ height: filter_box_height.toString() + "px", minHeight: min_filter_height.toString() + "px" }}
            >
                <div
                    className="resize-handle"
                    onMouseDown={handleMouseDown}
                >
                    <div className="resize-handle-bar" />
                </div>

                <FiltersBoxComp />
            </div>
        </div>
    );
};

export default SidebarComp;
