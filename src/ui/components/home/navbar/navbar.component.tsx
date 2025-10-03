import { FC, ReactNode, useEffect } from "react";
import "@/ui/components/home/navbar/navbar.component.css";
import { Link } from "react-router-dom";

const NavbarComp: FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: NavbarComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: NavbarComp");
    });

    return (
        <header id="navbar">
            <p>PolyHUB</p>
            <Link to="/login"><img src="/images/loginImage.png" style={{width:"30px"}} /></Link>
        </header>
    );
};

export default NavbarComp;
