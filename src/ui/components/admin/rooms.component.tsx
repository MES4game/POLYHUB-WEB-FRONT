import { FC, ReactNode, useEffect, useState } from "react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from "#/components/ui/item";
import { Location, Building } from "@/shared/models/common/location.model";
import { Button } from "#/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Dialog, DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { addRoom, addRoomNewBuilding, getAllBuildings, getAllRooms, deleteRoomById, updateRoom } from "@/api/admin.api";
import { useGeneralVars } from "@/shared/contexts/common/general.context";

const RoomsComp : FC = (): ReactNode => {
    const [rooms, setRooms] = useState<Location[]>([]);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const { token } = useGeneralVars();

    const { register, handleSubmit, reset } = useForm<IFormInput>();
    const { register: registerEdit, handleSubmit: handleEditSubmit, reset: resetEdit } = useForm<IEditFormInput>();

    useEffect(() => {
        console.log("Loaded: RoomsComp");

        getAllRooms(token.current).then(setRooms)
            .catch(console.error);

        getAllBuildings(token.current).then(setBuildings)
            .catch(console.error);
    }, []);

    useEffect(() => {
        console.log("Rendered: RoomsComp");
    });

    const deleteRoom = (id: number) => {
        const index = rooms.findIndex((r) => { return r.id === id; });
        
        if (rooms[index] === undefined) return;

        deleteRoomById(token.current, rooms[index].id).then(() => {
            rooms.splice(index, 1);
            setRooms([...rooms]);
        })
            .catch(console.error);
    };

    interface IFormInput {
        existing_building: string;
        building         : string;
        room             : string;
        description      : string;
        capacity         : number;
    }

    interface IEditFormInput {
        room       : string;
        description: string;
        capacity   : number;
    }

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        if (data.existing_building === "" && data.building === "") {
            alert("Veuillez sélectionner un bâtiment existant ou en ajouter un nouveau !");

            return;
        }

        let building_id = 0;

        if (data.existing_building !== "") {
            const building = buildings.find((b) => { return b.name === data.existing_building; });

            building_id = building?.id ?? 0;

            addRoom(token.current, building_id, data.room, data.description, data.capacity).then((new_room) => {
                if (new_room) {
                    reset();
                    setRooms([...rooms, new_room]);
                }
            })
                .catch(console.error);

            return;
        }
        else {
            addRoomNewBuilding(token.current, data.building, data.room, data.description, data.capacity).then((new_room) => {
                if (new_room) {
                    reset();
                    setRooms([...rooms, new_room]);
                }
            })
                .catch(console.error);

            return;
        }
    };

    const onEditSubmit = (data: IEditFormInput, id: number) => {
        const index = rooms.findIndex((r) => { return r.id === id; });

        if (rooms[index] === undefined) {
            console.error("Room not found for editing");

            return;
        }

        updateRoom(token.current, rooms[index].id, data.room, data.description, data.capacity).then(() => {
            resetEdit();
            if (!rooms[index]) return;
            rooms[index].name = data.room;
            rooms[index].description = data.description;
            rooms[index].capacity = data.capacity;
            setRooms([...rooms]);
        })
            .catch(console.error);
    };

    const getBuildingName = (building_id: number): string => {
        const building = buildings.find((b) => { return b.id === building_id; });

        return building ? building.name : "";
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="ml-1">Ajouter une salle</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajouter une salle</DialogTitle>
                    </DialogHeader>

                    <DialogDescription>
                        Ajouter une nouvelle salle à un bâtiment existant ou créer un nouveau bâtiment.
                    </DialogDescription>

                    <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }}>
                        <div className="flex flex-col gap-4 mt-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Sélectionner un bâtiment existant</label>

                                <select {...register("existing_building")} className="p-2 border rounded">
                                    <option value="">-- Choisir un bâtiment --</option>

                                    {buildings.map((b) => {
                                        return (
                                            <option value={b.name}>
                                                {b.name}
                                            </option>
                                        );
                                    })}
                                </select>

                                <div className="text-center text-xs text-gray-500 my-1">ou</div>
                                <label className="text-sm">Ajouter un nouveau bâtiment</label>
                            </div>

                            <Input type="text" {...register("building")} placeholder="Bâtiment" />
                            <Input type="text" {...register("room", { required: true })} placeholder="Salle" />
                            <textarea className="border rounded" {...register("description", { required: true })} placeholder="Description" />
                            <Input type="number" {...register("capacity", { required: true })} placeholder="Capacité" />

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

            <h1 className="ml-3 mt-3"><b>Gérer les salles</b></h1>

            <ItemGroup className="gap-0 max-w-3xl mb-15">
                {rooms.toSorted((a: Location, b: Location) => {
                    return a.building_id < b.building_id ? -1 : a.building_id === b.building_id ? 0 : 1;
                }).map((location: Location, index: number) => {
                    return (
                        <div key={index}>
                            <Item className="h-fit">
                                <ItemContent>
                                    <ItemTitle>{getBuildingName(location.building_id)} - {location.name}</ItemTitle>
                                    
                                    <ItemDescription className="whitespace-pre-line break-words truncate-none line-clamp-none">
                                        {location.description} <br />Capacité : {location.capacity} personnes
                                    </ItemDescription>
                                </ItemContent>

                                <ItemActions>
                                    <Dialog onOpenChange={(open) => {
                                        if (open) {
                                            // when opening the edit dialog, reset the edit form with the current room values
                                            resetEdit({
                                                room       : location.name,
                                                description: location.description,
                                                capacity   : location.capacity,
                                            });
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
                                                <DialogTitle>Modifier la salle</DialogTitle>
                                            </DialogHeader>

                                            <div className="flex flex-col gap-4 mt-4">
                                                <form onSubmit={(e) => { void handleEditSubmit((data) => { onEditSubmit(data, location.id); })(e); }}>

                                                    <Label>Salle</Label>

                                                    <Input
                                                        type="text"
                                                        {...registerEdit("room", { required: true })}
                                                        defaultValue={location.name}
                                                        placeholder="Salle"
                                                    />

                                                    <Label>Capacité</Label>

                                                    <Input
                                                        type="number"
                                                        {...registerEdit("capacity", { required: true })}
                                                        defaultValue={location.capacity}
                                                        placeholder="Capacité"
                                                    />

                                                    <Label>Description</Label>
                                                    <br />

                                                    <textarea
                                                        className="w-full border rounded"
                                                        {...registerEdit("description", { required: true })}
                                                        defaultValue={location.description}
                                                        placeholder="Description"
                                                    />

                                                    <br />

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
                                                <Trash2 />
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Supprimer la salle</DialogTitle>
                                                <DialogDescription>Cette action est irréversible.</DialogDescription>
                                            </DialogHeader>

                                            <div className="flex flex-col gap-4 mt-4">
                                                <DialogClose asChild>
                                                    <Button variant="destructive" onClick={() => { deleteRoom(location.id); }}>Supprimer</Button>
                                                </DialogClose>

                                                <DialogClose asChild>
                                                    <Button variant="outline">Annuler</Button>
                                                </DialogClose>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </ItemActions>
                            </Item>

                            {index !== rooms.length - 1 && <ItemSeparator />}
                        </div>
                    );
                })}
            </ItemGroup>
        </div>
    );
};

export default RoomsComp;
