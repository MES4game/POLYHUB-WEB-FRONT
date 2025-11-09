import { Item, ItemDescription, ItemContent, ItemTitle, ItemGroup, ItemActions } from "#/components/ui/item";
import { ItemSeparator } from "#/components/ui/item";
import { User } from "@/shared/models/user.model";
import { FC, ReactNode, useEffect, useState } from "react";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { getIsTeacher, getIsModo, setIsTeacher, setIsModo } from "@/api/user.api";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import { useReRender } from "@/shared/utils/common/hook.util";

const UsersComp : FC = (): ReactNode => {
    const { is_admin } = useGeneralVars();
    const [users, setUsers] = useState<User[]>([]);
    const [users_roles, setUsersRoles] = useState<{ user: User; is_teacher: boolean; is_modo: boolean }[]>([]);
    const reRender = useReRender();

    useEffect(() => {
        console.log("Loaded: UsersComp");

        const unsubscribers: (() => void)[] = [];

        unsubscribers.push(is_admin.subscribe(() => { reRender(); }));
        const users_test: User[] = [
            {
                id             : 1,
                pseudo         : "Palmi",
                email          : "mael.houpline@universite-paris-saclay.fr",
                firstname      : "Maël",
                lastname       : "Houpline",
                created_on     : new Date(),
                last_connection: new Date(),
            },
            {
                id             : 2,
                pseudo         : "Toast",
                email          : "julien.tap@universite-paris-saclay.fr",
                firstname      : "Julien",
                lastname       : "Tap",
                created_on     : new Date(),
                last_connection: new Date(),
            },
            {
                id             : 3,
                pseudo         : "MGQDG",
                email          : "marie-gabrielle.quentin-de-gromard@universite-paris-saclay.fr",
                firstname      : "Marie-Gabrielle",
                lastname       : "Quentin-de-Gromard",
                created_on     : new Date(),
                last_connection: new Date(),
            },
        ];
        setUsers(users_test);

        Promise.all(users_test.map(async (user) => { // eslint-disable-line
            const is_teacher = await getIsTeacher(user.id).then((res) => { return res; });
            const is_modo = await getIsModo(user.id).then((res) => { return res; });

            return { user, is_teacher: is_teacher, is_modo: is_modo };
        })).then(setUsersRoles);

        return () => { unsubscribers.forEach((fn) => { fn(); }); };
    }, []);

    useEffect(() => {
        console.log("Rendered: UsersComp");
    });

    return (
        <div>
            <h1 className="ml-3 mt-3"><b>Gérer les utilisateurs</b></h1>

            <ItemGroup className="max-w-3xl mt-6">
                {users_roles.map(({ user, is_teacher, is_modo }, index: number) => {
                    return (
                        <div key={user.id}>
                            <Item className="h-fit">
                                <ItemContent>
                                    <ItemTitle>{user.id}. {user.lastname} {user.firstname}</ItemTitle>
                                    
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
                                                void setIsTeacher(user.id, !is_teacher);

                                                setUsersRoles((prev) => {
                                                    return prev.map((role) => {
                                                        return role.user.id === user.id
                                                            ? { ...role, is_teacher: !is_teacher }
                                                            : role;
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
                                                        void setIsModo(user.id, !is_modo);

                                                        setUsersRoles((prev) => {
                                                            return prev.map((role) => {
                                                                return role.user.id === user.id
                                                                    ? { ...role, is_modo: !is_modo }
                                                                    : role;
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
