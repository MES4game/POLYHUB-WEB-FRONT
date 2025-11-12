import { FC, ReactNode, useEffect } from "react";
import "@/ui/components/home/navbar/navbar.component.css";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "#/components/ui/avatar";
import FormatButtonsComp, { CalendarFormat } from "@/ui/components/home/navbar/Format/formatButtons.component";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import { useReRender } from "@/shared/utils/common/hook.util";

interface NavbarCompProps {
    calendarformat?: CalendarFormat;
    onFormatChange?: (format: CalendarFormat) => void;
}

const NavbarComp: FC<NavbarCompProps> = ({ calendarformat, onFormatChange }): ReactNode => {
    const { token, is_admin, is_modo, user } = useGeneralVars();
    const reRender = useReRender();

    const handleDisconnect = (): void => {
        token.current = "";
        sessionStorage.removeItem("token");
    };

    useEffect(() => {
        console.log("Loaded: NavbarComp");

        const unsubscribers: (() => void)[] = [];

        unsubscribers.push(token.subscribe(() => { reRender(); }));
        unsubscribers.push(is_admin.subscribe(() => { reRender(); }));
        unsubscribers.push(is_modo.subscribe(() => { reRender(); }));
        unsubscribers.push(user.subscribe(() => { reRender(); }));

        return () => { unsubscribers.forEach((fn) => { fn(); }); };
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

            <Popover>
                <PopoverTrigger asChild>
                    <Avatar>
                        <AvatarImage src="/images/loginImage.png" />
                    </Avatar>
                </PopoverTrigger>
                
                <PopoverContent>
                    <nav>
                        <ul>
                            {!token.current && (
                                <>
                                    <li>
                                        <Link to="/login">Connexion</Link>
                                    </li>

                                    <li>
                                        <Link to="/register">Inscription</Link>
                                    </li>
                                </>
                            )}

                            {token.current
                                && (
                                    <>
                                        {"Connecté(e) en tant que "}
                                        {user.current.pseudo}

                                        <li>
                                            <Link
                                                to="/login"
                                                onClick={() => {
                                                    handleDisconnect();
                                                }}
                                            >
                                                Se déconnecter
                                            </Link>
                                        </li>

                                        {(is_admin.current || is_modo.current)
                                            && (
                                                <li>
                                                    <Link to="/admin">Page administrateur</Link>
                                                </li>
                                            )}
                                    </>
                                )}
                        </ul>
                    </nav>
                </PopoverContent>
            </Popover>
            
        </header>
    );
};

export default NavbarComp;
