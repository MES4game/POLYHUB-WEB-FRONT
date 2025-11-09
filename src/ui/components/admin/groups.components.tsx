import { FC, ReactNode, useEffect } from "react";

const GroupsComp : FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: GroupsComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: GroupsComp");
    });

    return (
        <p>Groups Component</p>
    );
};

export default GroupsComp;
