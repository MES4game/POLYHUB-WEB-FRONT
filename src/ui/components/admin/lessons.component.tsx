import { FC, ReactNode, useEffect } from "react";

const LessonsComp : FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: LessonsComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: LessonsComp");
    });

    return (
        <p>Lessons Component</p>
    );
};

export default LessonsComp;
