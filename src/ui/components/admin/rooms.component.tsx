import { FC, ReactNode, useEffect } from "react";

const RoomsComp : FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: RoomsComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: RoomsComp");
    });

    return (
        <p>Rooms Component</p>
    );
};

export default RoomsComp;
