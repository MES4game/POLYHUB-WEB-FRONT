import { unknownToString, unknownToNumber } from "@/shared/utils/common/convert.util";
import { createConverter, createMapper } from "@/shared/utils/common/mapper.util";

export interface LessonType {
    id         : number;
    name       : string;
    description: string;
}

export const mapLessonType = createMapper<LessonType>({
    id         : createConverter(unknownToNumber, 0),
    name       : createConverter(unknownToString, ""),
    description: createConverter(unknownToString, ""),
});
