import { FC, ReactNode, useEffect } from "react";
import "@/ui/pages/admin/admin.page.css";
import AdminTabsComp from "@/ui/components/admin/adminTabs.component";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import { useReRender } from "@/shared/utils/common/hook.util";
import { Link } from "react-router-dom";
import NavbarComp from "@/ui/components/admin/navbar/navbar.component";


const AdminPage: FC = (): ReactNode => {
    const { is_admin, is_modo } = useGeneralVars();
    const reRender = useReRender();

    useEffect(() => {
        console.log("Loaded: AdminPage");

        const unsubscribers: (() => void)[] = [];

        unsubscribers.push(is_admin.subscribe(() => { reRender(); }));
        unsubscribers.push(is_modo.subscribe(() => { reRender(); }));

        return () => { unsubscribers.forEach((fn) => { fn(); }); };
    }, []);

    useEffect(() => {
        console.log("Rendered: AdminPage");
    });

    return (
        <div id="admin-page">
            <NavbarComp />
            {(is_admin.current || is_modo.current) ? <AdminTabsComp /> : <Link to="/">Page indisponible</Link>}
        </div>
    );
};

export default AdminPage;
