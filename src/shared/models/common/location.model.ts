import { unknownToString } from "@/shared/utils/common/convert.util";
import { createConverter, createMapper } from "@/shared/utils/common/mapper.util";

export interface Location {
    building   : string;
    room       : string;
    description: string;
}

export const mapLocation = createMapper<Location>({
    building   : createConverter(unknownToString, ""),
    room       : createConverter(unknownToString, ""),
    description: createConverter(unknownToString, ""),
});
