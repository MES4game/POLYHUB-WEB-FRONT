import { FC, ReactNode, useEffect } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "#/components/ui/tabs";
import UsersComp from "@/ui/components/admin/users.components";
import AdminEDTComp from "@/ui/components/admin/edt.component";
import LessonsComp from "@/ui/components/admin/lessons.component";
import GroupsComp from "@/ui/components/admin/groups.components";
import RoomsComp from "@/ui/components/admin/rooms.component";
import PersoAccountComp from "@/ui/components/admin/personalAccount.component";

const AdminTabsComp : FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: AdminTabsComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: AdminTabsComp");
    });

    return (
        <div>
            <Tabs defaultValue="edt">
                <TabsList>
                    <TabsTrigger value="edt">EDT</TabsTrigger>
                    <TabsTrigger value="cours">Cours</TabsTrigger>
                    <TabsTrigger value="groupes">Groupes</TabsTrigger>
                    <TabsTrigger value="salles">Salles</TabsTrigger>
                    <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
                    <TabsTrigger value="perso">Mon compte</TabsTrigger>
                </TabsList>

                <TabsContent value="edt">
                    <AdminEDTComp />
                </TabsContent>

                <TabsContent value="cours">
                    <LessonsComp />
                </TabsContent>

                <TabsContent value="groupes">
                    <GroupsComp />
                </TabsContent>

                <TabsContent value="salles">
                    <RoomsComp />
                </TabsContent>

                <TabsContent value="utilisateurs">
                    <UsersComp />
                </TabsContent>

                <TabsContent value="perso">
                    <PersoAccountComp />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminTabsComp;
