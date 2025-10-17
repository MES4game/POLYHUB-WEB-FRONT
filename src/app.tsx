import { FC, lazy, ReactNode, useEffect, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingComp from "@/ui/components/common/loading.component";
import "@/app.css";
import "@/tailwind.css";

const HomePage  = lazy(() => { return import("@/ui/pages/home/home.page"); });
const LoginPage = lazy(() => { return import("@/ui/pages/login/login.page"); });
const RegisterPage = lazy(() => { return import("@/ui/pages/register/register.page"); });

const App: FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: App");
    }, []);

    useEffect(() => {
        console.log("Rendered: App");
    });

    return (
        <Suspense fallback={<LoadingComp />}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<HomePage />} />
            </Routes>
        </Suspense>
    );
};

export default App;
