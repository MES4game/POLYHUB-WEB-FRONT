import { FC, ReactNode, useEffect } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "#/components/ui/tabs";
import UsersComp from "@/ui/components/admin/users.components";
import AdminEDTComp from "@/ui/components/admin/edt/edt.component";
import LessonsComp from "@/ui/components/admin/lessons.component";
import GroupsComp from "@/ui/components/admin/groups.components";
import RoomsComp from "@/ui/components/admin/rooms.component";

const AdminTabsComp : FC = (): ReactNode => {
    useEffect(() => {
        console.log("Loaded: AdminTabsComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: AdminTabsComp");
    });

    return (
        <div className="h-screen overflow-y-auto">
            <Tabs defaultValue="edt">
                <TabsList>
                    <TabsTrigger value="edt">EDT</TabsTrigger>
                    <TabsTrigger value="cours">Cours</TabsTrigger>
                    <TabsTrigger value="groupes">Groupes</TabsTrigger>
                    <TabsTrigger value="salles">Salles</TabsTrigger>
                    <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
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
            </Tabs>
        </div>
    );
};

export default AdminTabsComp;
