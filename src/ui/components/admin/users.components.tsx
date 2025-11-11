import { Item, ItemDescription, ItemContent, ItemTitle, ItemGroup, ItemActions } from "#/components/ui/item";
import { ItemSeparator } from "#/components/ui/item";
import { User } from "@/shared/models/user.model";
import { FC, ReactNode, useEffect, useState } from "react";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { getIsTeacher, getIsModo, setIsTeacher, setIsModo, getAllUsers } from "@/api/user.api";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import { useReRender } from "@/shared/utils/common/hook.util";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";

const UsersComp : FC = (): ReactNode => {
    const { is_admin, token } = useGeneralVars();
    const [users, setUsers] = useState<User[]>([]);
    const [users_roles, setUsersRoles] = useState<{ user: User; is_teacher: boolean; is_modo: boolean }[]>([]);
    const reRender = useReRender();
    const [search_term, setSearchTerm] = useState<string>("");
    const [modo_only, setModoOnly] = useState<boolean>(false);
    const [teacher_only, setTeacherOnly] = useState<boolean>(false);

    useEffect(() => {
        console.log("Loaded: UsersComp");

        const unsubscribers: (() => void)[] = [];

        unsubscribers.push(token.subscribe(() => { reRender(); }));
        unsubscribers.push(is_admin.subscribe(() => { reRender(); }));

        getAllUsers(token.current).then((users) => {
            setUsers(users);
        })
            .catch((err: unknown) => { console.error(err); });

        return () => { unsubscribers.forEach((fn) => { fn(); }); };
    }, []);

    useEffect(() => {
        console.log("Rendered: UsersComp");
    });

    useEffect(() => {
        Promise.all(users.map(async (user) => { // eslint-disable-line
            const is_teacher = await getIsTeacher(token.current, user.id);
            const is_modo = await getIsModo(token.current, user.id);

            return { user, is_teacher: is_teacher, is_modo: is_modo };
        })).then(setUsersRoles);
    }, [users]);

    return (
        <div>
            <div id="search">
                <Label htmlFor="search-input" className="ml-3">Rechercher :</Label>

                <Input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={search_term}
                    onChange={(e) => { setSearchTerm(e.target.value); }}
                    className="ml-3 mb-3 w-64"
                />

                <br />

                <ToggleGroup type="multiple" variant="outline" className="flex justify-start">
                    <ToggleGroupItem value="teacher" onClick={() => { setTeacherOnly(!teacher_only); }}>
                        Intervenants uniquement
                    </ToggleGroupItem>

                    {is_admin.current && (
                        <ToggleGroupItem value="modo" onClick={() => { setModoOnly(!modo_only); }}>
                            Modérateurs uniquement
                        </ToggleGroupItem>
                    )}
                </ToggleGroup>
            </div>

            <h1 className="ml-3 mt-3"><b>Gérer les utilisateurs</b></h1>

            <ItemGroup className="max-w-3xl mt-6">
                {users_roles.filter((user) => {
                    const fullname = `${user.user.firstname} ${user.user.lastname}`;

                    return (user.user.firstname.toLowerCase().includes(search_term.toLowerCase())
                        || user.user.lastname.toLowerCase().includes(search_term.toLowerCase())
                        || fullname.toLowerCase().includes(search_term.toLowerCase()))
                    && ((!teacher_only || user.is_teacher) && (!modo_only || user.is_modo));
                }).map(({ user, is_teacher, is_modo }, index: number) => {
                    return (
                        <div key={user.id}>
                            <Item className="h-fit">
                                <ItemContent>
                                    <ItemTitle>{user.pseudo} ({user.lastname} {user.firstname})</ItemTitle>
                                    
                                    <ItemDescription className="whitespace-pre-line break-words truncate-none line-clamp-none">
                                        {user.email}
                                    </ItemDescription>
                                </ItemContent>

                                <ItemActions>
                                    <div className="flex flex-row items-center gap-2">
                                        <Label>Intervenant: </Label>

                                        <Input
                                            type="checkbox"
                                            checked={is_teacher}
                                            className="h-full"
                                            onChange={() => {
                                                setIsTeacher(token.current, user.id, !is_teacher).then(() => { // eslint-disable-line
                                                    setUsersRoles((prev) => {
                                                        return prev.map((role) => {
                                                            return role.user.id === user.id
                                                                ? { ...role, is_teacher: !is_teacher }
                                                                : role;
                                                        });
                                                    });
                                                });
                                            }}
                                        />

                                        {is_admin.current && (
                                            <>
                                                <Label>Modérateur: </Label>

                                                <Input
                                                    type="checkbox"
                                                    checked={is_modo}
                                                    className="h-full"
                                                    onChange={() => {
                                                        setIsModo(token.current, user.id, !is_modo).then(() => { // eslint-disable-line
                                                            setUsersRoles((prev) => {
                                                                return prev.map((role) => {
                                                                    return role.user.id === user.id
                                                                        ? { ...role, is_modo: !is_modo }
                                                                        : role;
                                                                });
                                                            });
                                                        });
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                </ItemActions>

                            </Item>

                            {index !== users.length - 1 && <ItemSeparator />}
                        </div>
                    );
                })}
            </ItemGroup>
        </div>
    );
};

export default UsersComp;
