import { unknownToNumber, unknownToString } from "@/shared/utils/common/convert.util";
import { createConverter, createMapper } from "@/shared/utils/common/mapper.util";

export interface Location {
    id         : number;
    building_id: number;
    name       : string;
    description: string;
    capacity   : number;
}

export const mapLocation = createMapper<Location>({
    id         : createConverter(unknownToNumber, 0),
    building_id: createConverter(unknownToNumber, 0), // eslint-disable-line
    name       : createConverter(unknownToString, ""),
    description: createConverter(unknownToString, ""),
    capacity   : createConverter(unknownToNumber, 0),
});

export interface Building {
    id         : number;
    name       : string;
    description: string;
}

export const mapBuilding = createMapper<Building>({
    id         : createConverter(unknownToNumber, 0),
    name       : createConverter(unknownToString, ""),
    description: createConverter(unknownToString, ""),
});
