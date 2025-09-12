import { FC, ReactNode, useEffect } from "react";
import "@/ui/components/navbar/navbar.component.css";

const NavbarComp: FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: NavbarComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: NavbarComp");
    });

    return (
        <header id='navbar'>
            <p>PolyHUB</p>
        </header>
    );
}

export default NavbarComp;
