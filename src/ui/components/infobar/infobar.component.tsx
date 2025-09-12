import { FC, ReactNode, useEffect } from "react";
import "@/ui/components/infobar/infobar.component.css";

const InfobarComp: FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: InfobarComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: InfobarComp");
    });

    return (
        <footer id='infobar'>
            <p>&copy; 2025 Maxime DAUPHIN, Maël HOUPLINE, Julien TAP</p>
        </footer>
    );
}

export default InfobarComp;
