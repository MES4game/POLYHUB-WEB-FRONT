import { FC, ReactNode, createContext, useContext, useEffect } from "react";
import { SmartRef } from "@/shared/models/common/hook.model";
import { useSmartRef } from "@/shared/utils/common/hook.util";
import { mapUser, User } from "@/shared/models/user.model";
import { getSelf, getSelfIsAdmin, getSelfIsModo } from "@/api/user.api";

interface GeneralVarsType {
    token       : SmartRef<string>;
    user        : SmartRef<User>;
    is_admin    : SmartRef<boolean>;
    is_modo     : SmartRef<boolean>;
    selecteddate: SmartRef<Date | undefined>;
}

const GeneralVarsContext = createContext<GeneralVarsType | undefined>(undefined);

export interface GeneralVarsProviderProps {
    readonly children: ReactNode;
}

export const GeneralVarsProvider: FC<GeneralVarsProviderProps> = (props: GeneralVarsProviderProps): ReactNode => {
    const context_value: GeneralVarsType = {
        token       : useSmartRef(""),
        user        : useSmartRef(mapUser({})),
        is_admin    : useSmartRef(false),
        is_modo     : useSmartRef(false),
        selecteddate: useSmartRef<Date | undefined>(new Date()),
    };

    useEffect(() => {
        console.log("Loaded: GeneralVarsProvider");

        const unsubscribers: (() => void)[] = [];

        unsubscribers.push(context_value.token.subscribe((_, curr) => { sessionStorage.setItem("token", curr); }));

        unsubscribers.push(context_value.token.subscribe((_, curr) => {
            getSelf(curr)
                .then((value) => { context_value.user.current = value; })
                .catch(alert);
        }, true));

        unsubscribers.push(context_value.token.subscribe((_, curr) => {
            getSelfIsAdmin(curr)
                .then((value) => { context_value.is_admin.current = value; })
                .catch(alert);
        }, true));

        unsubscribers.push(context_value.token.subscribe((_, curr) => {
            getSelfIsModo(curr)
                .then((value) => { context_value.is_modo.current = value; })
                .catch(alert);
        }, true));

        context_value.token.current = sessionStorage.getItem("token") ?? "";

        return () => { unsubscribers.forEach((fn) => { fn(); }); };
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

    if (!context) throw new Error("useGeneralVars must be used within a GeneralVarsProvider");

    return context;
}
