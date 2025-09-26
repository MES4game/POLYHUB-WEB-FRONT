import { unknownToBoolean, unknownToString } from "@/shared/utils/common/convert.util";
import { createConverter, createMapper } from "@/shared/utils/common/mapper.util";

const TMP_ENV = process.env;

interface IEnv {
    dev : boolean;
    host: string;
}

const mapEnv = createMapper<IEnv>({
    dev : createConverter(unknownToBoolean, false),
    host: createConverter(unknownToString, "localhost"),
});

export const ENV = mapEnv({
    dev : TMP_ENV.NODE_ENV === "development",
    host: TMP_ENV.HOST ?? "localhost",
});
