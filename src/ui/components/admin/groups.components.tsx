import { FC, ReactNode, useEffect, useState } from "react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from "#/components/ui/item";
import { Button } from "#/components/ui/button";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { Dialog, DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { Group } from "@/shared/models/common/group.model";
import { getAllGroups, deleteGroupById, addGroup, updateGroup } from "@/api/admin.api";
import { useReRender } from "@/shared/utils/common/hook.util";
import { useGeneralVars } from "@/shared/contexts/common/general.context";

const GroupsComp : FC = (): ReactNode => {
    const { token } = useGeneralVars();
    const [groups, setGroups] = useState<Group[]>([]);
    const [search_term, setSearchTerm] = useState<string>("");
    const reRender = useReRender();

    const { register, handleSubmit, reset } = useForm<IFormInput>();
    const { register: registerEdit, handleSubmit: handleEditSubmit, reset: resetEdit } = useForm<IFormInput>();
    const { register: registerAdd, handleSubmit: handleAddSubmit, reset: resetAdd } = useForm<IAddFormInput>();

    useEffect(() => {
        const unsubscribers: (() => void)[] = [];

        unsubscribers.push(token.subscribe(() => { reRender(); }));

        console.log("Loaded: GroupsComp");

        getAllGroups(token.current).then((groups) => {
            setGroups(groups);
        })
            .catch((err: unknown) => { console.error(err); });

        return () => { unsubscribers.forEach((fn) => { fn(); }); };
    }, []);

    useEffect(() => {
        console.log("Rendered: GroupsComp");
    });

    const deleteGroup = (id: number) => {
        deleteGroupById(token.current, id).then(() => { // eslint-disable-line
            setGroups(groups.filter((group) => { return group.id !== id; }));
        });
    };

    interface IFormInput {
        name       : string;
        description: string;
    }

    interface IAddFormInput {
        parent_id  : number;
        name       : string;
        description: string;
    }

    const getParentName = (parent_id: number | null) => {
        const parent_group = groups.find((group) => { return group.id === parent_id; });

        return parent_group ? parent_group.name : "";
    };

    const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
        const group = await addGroup(token.current, 1, data.name, data.description);
        if (!group) return;
        setGroups([...groups, group]);
        reset();
    };

    const onEditSubmit = async (data: IFormInput, index: number) => {
        const group_to_edit = groups[index];
        if (!group_to_edit) return;
        await updateGroup(token.current, group_to_edit.id, data.name, data.description);
        const edited_group: Group = {
            id         : group_to_edit.id,
            parentId   : group_to_edit.parentId,
            name       : data.name,
            description: data.description,
        };
        groups[index] = edited_group;
        setGroups([...groups]);
        resetEdit();
    };

    const onAddSubmit = async (data: IAddFormInput, index: number) => {
        const group = await addGroup(token.current, index, data.name, data.description);
        if (!group) return;
        setGroups([...groups, group]);
        resetAdd();
    };

    return (
        <div className="mb-15">
            <div id="search">
                <Label htmlFor="search-input" className="ml-3">Rechercher :</Label>

                <Input
                    type="text"
                    placeholder="Rechercher un groupe..."
                    value={search_term}
                    onChange={(e) => { setSearchTerm(e.target.value); }}
                    className="ml-3 mb-3 w-64"
                />
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="ml-1">Ajouter un groupe</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajouter un groupe</DialogTitle>
                    </DialogHeader>

                    <DialogDescription>
                        Ajouter un nouveau groupe sans parent
                    </DialogDescription>

                    <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }}>
                        <div className="flex flex-col gap-4 mt-4">

                            <Input type="text" {...register("name", { required: true })} placeholder="Nom du groupe" />
                            <textarea className="border rounded" {...register("description", { required: true })} placeholder="Description" />

                            <DialogClose asChild>
                                <Button type="submit">Ajouter</Button>
                            </DialogClose>

                            <DialogClose asChild>
                                <Button variant="outline">Annuler</Button>
                            </DialogClose>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <h1 className="ml-3 mt-3"><b>Gérer les groupes</b></h1>

            <ItemGroup className="gap-0 max-w-3xl">
                {groups.toSorted((a: Group, b: Group) => {
                    return a.id - b.id;
                })
                    .filter((group: Group) => {
                        return group.name.toLowerCase().includes(search_term.toLowerCase());
                    })
                    .map((group: Group, index: number) => {
                        return (
                            <div key={group.id}>
                                <Item className="h-fit">
                                    <ItemContent>
                                        <ItemTitle>{group.id}. {group.name}</ItemTitle>
                                    
                                        <ItemDescription className="whitespace-pre-line break-words truncate-none line-clamp-none">
                                        {group.parentId != -1 && `Sous-groupe de ${group.parentId}. ${getParentName(group.parentId)}\n` /* eslint-disable-line*/ }
                                            {group.description}
                                        </ItemDescription>
                                    </ItemContent>

                                    <ItemActions>
                                        <Dialog onOpenChange={(open) => {
                                            if (open) {
                                            // when opening the edit dialog, reset the edit form with the current group values
                                                reset();
                                            }
                                        }}
                                        >
                                            <DialogTrigger asChild>
                                                <Button>
                                                    <Edit />
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Modifier le groupe</DialogTitle>
                                                </DialogHeader>

                                                <div className="flex flex-col gap-4 mt-4">
                                                    <form onSubmit={(e) => {
                                                        void handleEditSubmit((data) => {
                                                            void onEditSubmit(data, index);
                                                        })(e);
                                                    }}
                                                    >
                                                        <Label>Nom</Label>

                                                        <Input
                                                            type="text"
                                                            {...registerEdit("name", { required: true })}
                                                            defaultValue={group.name}
                                                            placeholder="Nom du groupe"
                                                        />

                                                        <Label>Description</Label>
                                                        <br />

                                                        <textarea
                                                            className="w-full border rounded"
                                                            {...registerEdit("description", { required: true })}
                                                            defaultValue={group.description}
                                                            placeholder="Description"
                                                        />

                                                        <DialogClose asChild>
                                                            <Button type="submit">Enregistrer</Button>
                                                        </DialogClose>

                                                        <DialogClose asChild>
                                                            <Button variant="outline">Annuler</Button>
                                                        </DialogClose>
                                                    </form>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button>
                                                    <PlusCircle />
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Ajouter un sous-groupe</DialogTitle>
                                                </DialogHeader>

                                                <DialogDescription>
                                                    Ajouter un nouveau sous-groupe à {group.name}
                                                </DialogDescription>

                                                <form onSubmit={(e) => { void handleAddSubmit((data) => { void onAddSubmit(data, group.id); })(e); }}>
                                                    <div className="flex flex-col gap-4 mt-4">

                                                        <Input type="text" {...registerAdd("name", { required: true })} placeholder="Nom du groupe" />
                                                    
                                                        <textarea
                                                            className="border rounded"
                                                            {...registerAdd("description", { required: true })}
                                                            placeholder="Description"
                                                        />

                                                        <DialogClose asChild>
                                                            <Button type="submit">Valider</Button>
                                                        </DialogClose>
                                                    </div>
                                                </form>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button>
                                                    <Trash2 />
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Supprimer le groupe</DialogTitle>
                                                    <DialogDescription>Cette action est irréversible.</DialogDescription>
                                                </DialogHeader>

                                                <div className="flex flex-col gap-4 mt-4">
                                                    <DialogClose asChild>
                                                        <Button variant="destructive" onClick={() => { deleteGroup(group.id); }}>Supprimer</Button>
                                                    </DialogClose>

                                                    <DialogClose asChild>
                                                        <Button variant="outline">Annuler</Button>
                                                    </DialogClose>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </ItemActions>
                                </Item>

                                {index !== groups.length - 1 && <ItemSeparator />}
                            </div>
                        );
                    })}
            </ItemGroup>
        </div>
    );
};

export default GroupsComp;
