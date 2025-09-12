import { FC, lazy, ReactNode, useEffect, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { GeneralVarsProvider } from '@/shared/contexts/common/general.context';
import NavbarComp from '@/ui/components/navbar/navbar.component';
import InfobarComp from '@/ui/components/infobar/infobar.component';
import "@/app.css";

const LoadingComp:  FC = lazy(() => import('@/ui/components/common/loading.component'));
const HomePage:     FC = lazy(() => import('@/ui/pages/home/home.page'));
const NotFoundPage: FC = lazy(() => import('@/ui/pages/not_found.page'));

const App: FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: App");
    }, []);

    useEffect(() => {
        console.log("Rendered: App");
    });

    return (
        <GeneralVarsProvider>
            <NavbarComp />
            <main id='main'>
                <Suspense fallback={<LoadingComp />}>
                    <Routes>
                        <Route path='/' element={ <HomePage /> } />
                        <Route path='*' element={ <NotFoundPage /> } />
                    </Routes>
                </Suspense>
            </main>
            <InfobarComp />
        </GeneralVarsProvider>
    );
}

export default App;
