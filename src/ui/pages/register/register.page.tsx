import { FC, ReactNode, useEffect } from "react";
import "@/ui/pages/login/login.page.css";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import { useReRender } from "@/shared/utils/common/hook.util";
import RegisterFormComp from "@/ui/components/log/register-form.component";


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
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <RegisterFormComp />
            </div>
        </div>
    );
};

export default LoginPage;
