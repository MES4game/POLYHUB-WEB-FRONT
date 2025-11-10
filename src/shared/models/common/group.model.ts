import { unknownToString, unknownToNumber } from "@/shared/utils/common/convert.util";
import { createConverter, createMapper } from "@/shared/utils/common/mapper.util";

export interface Group {
    id         : number;
    parentId   : number | null; // eslint-disable-line @typescript-eslint/naming-convention
    name       : string;
    description: string;
}

export const mapGroup = createMapper<Group>({
    id         : createConverter(unknownToNumber, 0),
    parentId   : createConverter(unknownToNumber, null),
    name       : createConverter(unknownToString, ""),
    description: createConverter(unknownToString, ""),
});
