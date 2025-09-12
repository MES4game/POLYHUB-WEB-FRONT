import { FC, ReactNode, createContext, useContext, useEffect } from "react";
import { SmartRef } from "@/shared/models/common/hook.model";
import { useSmartRef } from "@/shared/utils/common/hook.util";
import { ComponentProps } from "@/shared/models/common/props.model";

interface GeneralVarsType {
    readonly dev: SmartRef<boolean>;
}

const GeneralVarsContext = createContext<GeneralVarsType | undefined>(undefined);

export interface GeneralVarsProviderProps {
    readonly children: ReactNode;
}

export const GeneralVarsProvider: FC<ComponentProps> = (props: ComponentProps): ReactNode => {
    const context_value: GeneralVarsType = {
        dev: useSmartRef(process.env.NODE_ENV === "development")
    };

    useEffect(() => {
        console.log("Loaded: GeneralVarsProvider");
    }, []);

    useEffect(() => {
        console.log("Rendered: GeneralVarsProvider");
    });

    return (
        <GeneralVarsContext.Provider value={context_value}>
            {props.children}
        </GeneralVarsContext.Provider>
    );
};

export function useGeneralVars(): GeneralVarsType {
    const context = useContext(GeneralVarsContext);

    if (!context)
        throw new Error("useGeneralVars must be used within a GeneralVarsProvider");

    return context;
};
