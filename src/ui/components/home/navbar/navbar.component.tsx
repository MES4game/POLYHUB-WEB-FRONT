import { FC, ReactNode, useEffect } from "react";
import "@/ui/components/home/navbar/navbar.component.css";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "#/components/ui/avatar";
import FormatButtonsComp, { CalendarFormat } from "@/ui/components/home/navbar/Format/formatButtons.component";

interface NavbarCompProps {
    calendarformat?: CalendarFormat;
    onFormatChange?: (format: CalendarFormat) => void;
}

const NavbarComp: FC<NavbarCompProps> = ({ calendarformat, onFormatChange }): ReactNode => {
    useEffect(() => {
        console.log("Loaded: NavbarComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: NavbarComp");
    });

    return (
        <header id="navbar">
            <Link to="/"><b>PolyHUB</b></Link>
            
            {calendarformat && onFormatChange && (
                <FormatButtonsComp
                    value={calendarformat}
                    onValueChange={onFormatChange}
                />
            )}

            <Link to="/login">
                <Avatar>
                    <AvatarImage src="/images/loginImage.png" />
                </Avatar>
            </Link>
        </header>
    );
};

export default NavbarComp;
