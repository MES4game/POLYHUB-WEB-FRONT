import { FC, ReactNode, useEffect, useState } from "react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from "#/components/ui/item";
import { Location } from "@/shared/models/common/location.model";
import { Button } from "#/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { Dialog, DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

const RoomsComp : FC = (): ReactNode => {
    
    const [rooms, setRooms] = useState<Location[]>([]);

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        // toDo call API to init rooms
        console.log("Loaded: RoomsComp");
        const rooms_test: Location[] = [
            {
                building   : "620",
                room       : "B007",
                description: "Toto",
            },
            {
                building   : "640",
                room       : "E103",
                description: "Tata",
            },
        ];
        setRooms(rooms_test);
    }, []);

    useEffect(() => {
        console.log("Rendered: RoomsComp");
    });

    const deleteRoom = (index: number) => {
        // toDo call API to delete room
        rooms.splice(index, 1);
        setRooms([...rooms]);
    };

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        // toDo call API to add room
        const newRoom: Location = {
            building: data.existingBuilding || data.building,
            room: data.room,
            description: data.description,
        };
        for (const room of rooms) {
            if (room.building === newRoom.building && room.room === newRoom.room) {
                reset();
                alert("La salle existe déjà !");
                return;
            }
        }
        reset();
        setRooms([...rooms, newRoom]);
    }

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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-4 mt-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Sélectionner un bâtiment existant</label>
                                <select {...register("existingBuilding")} className="p-2 border rounded">
                                    <option value="">-- Choisir un bâtiment --</option>
                                    {Array.from(new Set(rooms.map((r) => { return r.building; }))).map((b) => {
                                        return (
                                            <option value={b}>
                                                {b}
                                            </option>
                                        );
                                    })}
                                </select>
                                <div className="text-center text-xs text-gray-500 my-1">ou</div>
                                <label className="text-sm">Ajouter un nouveau bâtiment</label>
                            </div>
                            <Input type="text" {...register("building")} placeholder="Bâtiment" />
                            <Input type="text" {...register("room", { required: true })} placeholder="Salle" />
                            <textarea {...register("description", { required: true })} placeholder="Description" />
                            <DialogClose asChild>
                                <Button type="submit">Ajouter</Button>
                            </DialogClose>

                    <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DialogClose>
                </div>
                </form>
            </DialogContent>
        </Dialog><h1 className="ml-3 mt-3"><b>Gérer les salles</b></h1><ItemGroup className="gap-0 max-w-sm">
                {rooms.map((location: Location, index: number) => {
                    return (
                        <div key={index}>
                            <Item>
                                <ItemContent>
                                    <ItemTitle>Bâtiment : {location.building}</ItemTitle>
                                    <ItemDescription>Salle : {location.room} <br /> {location.description}</ItemDescription>
                                </ItemContent>

                                <ItemActions>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <EllipsisVertical className="color-black hover:bg-gray-200 rounded-full" />
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Supprimer la salle</DialogTitle>
                                                <DialogDescription>Cette action est irréversible.</DialogDescription>
                                            </DialogHeader>

                                            <div className="flex flex-col gap-4 mt-4">
                                                <DialogClose asChild>
                                                    <Button variant="destructive" onClick={() => { deleteRoom(index); } }>Supprimer</Button>
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
