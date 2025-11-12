import { unknownToString, unknownToNumber } from "@/shared/utils/common/convert.util";
import { createConverter, createMapper } from "@/shared/utils/common/mapper.util";

export interface Lesson {
    id         : number;
    name       : string;
    description: string;
    color      : string;
}

export const mapLesson = createMapper<Lesson>({
    id         : createConverter(unknownToNumber, 0),
    name       : createConverter(unknownToString, ""),
    description: createConverter(unknownToString, ""),
    color      : createConverter(unknownToString, "blue"),
});

export interface LessonGroup {
    group_id      : number;
    lesson_args   : number;
    lesson_type_id: number;
    lesson_id     : number;
}

export const mapLessonGroup = createMapper<LessonGroup>({
    group_id      : createConverter(unknownToNumber, 0), // eslint-disable-line @typescript-eslint/naming-convention
    lesson_id     : createConverter(unknownToNumber, 0), // eslint-disable-line @typescript-eslint/naming-convention
    lesson_type_id: createConverter(unknownToNumber, 0), // eslint-disable-line @typescript-eslint/naming-convention
    lesson_args   : createConverter(unknownToNumber, 0), // eslint-disable-line @typescript-eslint/naming-convention
});

export interface LessonGroup {
    lesson_args   : number;
    lesson_type_id: number;
    lesson_id     : number;
}

export const mapLessonGroup = createMapper<LessonGroup>({
    lesson_id     : createConverter(unknownToNumber, 0), // eslint-disable-line @typescript-eslint/naming-convention
    lesson_type_id: createConverter(unknownToNumber, 0), // eslint-disable-line @typescript-eslint/naming-convention
    lesson_args   : createConverter(unknownToNumber, 0), // eslint-disable-line @typescript-eslint/naming-convention
});
