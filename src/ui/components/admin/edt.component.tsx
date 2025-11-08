import { FC, ReactNode, useEffect } from "react";

const AdminEDTComp : FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: AdminEDTComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: AdminEDTComp");
    });

    return (
        <p>EDT Component</p>
    );
};

export default AdminEDTComp;
