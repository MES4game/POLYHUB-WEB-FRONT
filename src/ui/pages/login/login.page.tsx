import { FC, ReactNode, useEffect } from "react";
import "@/ui/pages/login/login.page.css";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import { useReRender } from "@/shared/utils/common/hook.util";


const LoginPage: FC = (): ReactNode => {
    const context = useGeneralVars();
    const reRender = useReRender();
    context.user.subscribe(reRender);

    useEffect(() => {
        console.log("Loaded: HomePage");
    }, []);

    useEffect(() => {
        console.log("Rendered: HomePage");
    });

    return (
        <p>Page de login</p>
    );
};

export default LoginPage;
