import { Button } from "#/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { Item, ItemDescription, ItemContent, ItemTitle, ItemGroup, ItemActions } from "#/components/ui/item";
import { ItemSeparator } from "#/components/ui/item";
import { User } from "@/shared/models/user.model";
import { EllipsisVertical } from "lucide-react";
import { FC, ReactNode, useEffect, useState } from "react";

const UsersComp : FC = (): ReactNode => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        console.log("Loaded: UsersComp");
        const users_test: User[] = [
            {
                id             : 1,
                pseudo         : "Palmi",
                email          : "test@test.com",
                firstname      : "Maël",
                lastname       : "Houpline",
                created_on     : new Date(),
                last_connection: new Date(),
            },
            {
                id             : 2,
                pseudo         : "Toast",
                email          : "test2@test.com",
                firstname      : "Julien",
                lastname       : "Tap",
                created_on     : new Date(),
                last_connection: new Date(),
            },
            {
                id             : 3,
                pseudo         : "MES4Game",
                email          : "test3@test.com",
                firstname      : "Maxime",
                lastname       : "Dauphin",
                created_on     : new Date(),
                last_connection: new Date(),
            },
        ];
        setUsers(users_test);
    }, []);

    useEffect(() => {
        console.log("Rendered: UsersComp");
    });

    return (
        <div>
            <h1 className="ml-3 mt-3"><b>Gérer les utilisateurs</b></h1>

            <ItemGroup className="max-w-sm">
                {users.map((user: User, index: number) => {
                    return (
                        <div key={index}>
                            <Item className="h-fit">
                                <ItemContent>
                                    <ItemTitle>{user.id}. {user.pseudo}</ItemTitle>
                                    
                                    <ItemDescription className="whitespace-pre-line break-words truncate-none line-clamp-none">
                                        {user.lastname} {user.firstname} <br /> {user.email}
                                    </ItemDescription>
                                </ItemContent>

                                <ItemActions>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="rounded-full">
                                                <EllipsisVertical />
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Gérer l'utilisateur</DialogTitle>
                                            </DialogHeader>

                                            <div className="flex flex-row justify-between">
                                                <Button>Passer l'utilisateur intervenant</Button>
                                                <Button>Quitter</Button>
                                            </div>
                                        </DialogContent>

                                    </Dialog>
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
