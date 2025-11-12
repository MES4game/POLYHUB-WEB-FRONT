import { FC, ReactNode, createContext, useContext } from "react";
import { SmartRef } from "@/shared/models/common/hook.model";
import { useSmartRef } from "@/shared/utils/common/hook.util";

interface FilterContextType {
    selected_groups: SmartRef<string[]>;
    applied_groups : SmartRef<string[]>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export interface FilterProviderProps {
    readonly children: ReactNode;
}

export const FilterProvider: FC<FilterProviderProps> = (props: FilterProviderProps): ReactNode => {
    const context_value: FilterContextType = {
        selected_groups: useSmartRef<string[]>([]),
        applied_groups : useSmartRef<string[]>([]),
    };

    return (
        <FilterContext.Provider value={context_value}>
            {props.children}
        </FilterContext.Provider>
    );
};

export function useFilters(): FilterContextType {
    const context = useContext(FilterContext);

    if (!context) throw new Error("useFilters must be used within a FilterProvider");

    return context;
}
