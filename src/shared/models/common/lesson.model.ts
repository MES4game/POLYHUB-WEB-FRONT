import { unknownToString, unknownToNumber } from "@/shared/utils/common/convert.util";
import { createConverter, createMapper } from "@/shared/utils/common/mapper.util";

export interface Lesson {
    id         : number;
    name       : string;
    description: string;
}

export const mapLesson = createMapper<Lesson>({
    id         : createConverter(unknownToNumber, 0),
    name       : createConverter(unknownToString, ""),
    description: createConverter(unknownToString, ""),
});
