import { FC, ReactNode, useEffect } from "react";
import "@/ui/pages/login/login.page.css";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import { useReRender } from "@/shared/utils/common/hook.util";
import LoginFormComp from "@/ui/components/log/login-form.component";


const LoginPage: FC = (): ReactNode => {
    const context = useGeneralVars();
    const reRender = useReRender();
    context.user.subscribe(reRender);

    useEffect(() => {
        console.log("Loaded: LoginPage");
    }, []);

    useEffect(() => {
        console.log("Rendered: LoginPage");
    });

    return (
        <div className="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
            <div className="min-w-sm">
                <LoginFormComp />
            </div>
        </div>
    );
};

export default LoginPage;
