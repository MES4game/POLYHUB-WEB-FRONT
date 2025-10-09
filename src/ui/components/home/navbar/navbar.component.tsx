import { FC, ReactNode, useEffect } from "react";
import "@/ui/components/home/navbar/navbar.component.css";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "#/components/ui/avatar";

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
            
            <Link to="/login">
                <Avatar>
                    <AvatarImage src="/images/loginImage.png" />
                </Avatar>
            </Link>
        </header>
    );
};

export default NavbarComp;
