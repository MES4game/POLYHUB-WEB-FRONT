import { FC, ReactNode, useEffect } from "react";
import "@/ui/pages/home/login.page.css";
import React from "react";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import { useReRender } from "@/shared/utils/common/hook.util";


const LoginPage: FC = (): ReactNode => {
    const context = useGeneralVars();
    const reRender = useReRender();
    context.user.subscribe(reRender)
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    useEffect(() => {
        console.log("Loaded: HomePage");
    }, []);

    useEffect(() => {
        console.log("Rendered: HomePage");
    });

    return (
        <p>{context.user.current.pseudo}</p>
    );
};

export default LoginPage;
