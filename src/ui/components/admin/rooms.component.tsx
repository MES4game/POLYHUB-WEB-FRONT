import { FC, ReactNode, useEffect } from "react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from "#/components/ui/item";
import { Location } from "@/shared/models/common/location.model";
import { Button } from "#/components/ui/button";
import { PlusCircleIcon } from "lucide-react";

const RoomsComp : FC = (): ReactNode => {
    const rooms_test: Location[] = [
        {
            building: "620",
            room    : "B007",
            description: "Toto",
        },
        {
            building: "620",
            room    : "B009",
            description: "Tata",
        },
        {
            building: "620",
            room    : "B007",
            description: "Toto",
        },
        {
            building: "620",
            room    : "B009",
            description: "Tata",
        },
        {
            building: "620",
            room    : "B007",
            description: "Toto",
        },
        {
            building: "620",
            room    : "B009",
            description: "Tata",
        },
        {
            building: "620",
            room    : "B009",
            description: "Tata",
        },
        {
            building: "620",
            room    : "B009",
            description: "Tata",
        },
    ];

    useEffect(() => {
        console.log("Loaded: RoomsComp");
    }, []);

    useEffect(() => {
        console.log("Rendered: RoomsComp");
    });

    return (
        <div>
            <Button className="ml-1">Ajouter une salle</Button>
            <h1 className="ml-3 mt-5">Gérer les salles</h1>
            <ItemGroup className="gap-0 max-w-sm">
                {rooms_test.map((location: Location, index: number) => (
                    <div>
                            <Item>
                                <ItemContent>
                                    <ItemTitle>Bâtiment : {location.building}</ItemTitle>
                                    <ItemDescription>Salle : {location.room} <br /> {location.description}</ItemDescription>
                                </ItemContent>

                                <ItemActions>
                                    <Button>
                                        <PlusCircleIcon />
                                    </Button>
                                </ItemActions>
                            </Item>

                            {index !== rooms_test.length - 1 && <ItemSeparator />}
                        </div>
                    )
                )}
            </ItemGroup>
        </div>
    );
};

export default RoomsComp;
