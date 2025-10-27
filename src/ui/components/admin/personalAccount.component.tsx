import { FC, ReactNode, useEffect } from "react";

const PersoAccountComp : FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: PersoAccountComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: PersoAccountComp");
    });

    return (
        <p>Personnal Account Component</p>
    );
};

export default PersoAccountComp;
