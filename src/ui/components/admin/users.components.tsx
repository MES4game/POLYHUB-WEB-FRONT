import { FC, ReactNode, useEffect } from "react";

const UsersComp : FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: UsersComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: UsersComp");
    });

    return (
        <p>Users Component</p>
    );
};

export default UsersComp;
