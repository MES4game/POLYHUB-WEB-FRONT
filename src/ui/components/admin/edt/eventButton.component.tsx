import { FC, ReactNode, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "#/components/ui/button";
import "./eventButton.component.css";
import { EventDialogComp } from "./eventDialog.component";

const EventButtonComp: FC = (): ReactNode => {
    const [isdialogopen, setIsDialogOpen] = useState(false);

    return (
        <>
            <div className="w-full flex items-start justify-center px-4 pt-4 pb-2">
                <Button
                    variant="default"
                    size="default"
                    className="new-event-button w-full"
                    onClick={() => { setIsDialogOpen(true); }}
                >
                    Ajouter un cours
                    <Plus className="h-4 w-4" />
                </Button>

                <EventDialogComp
                    isopen={isdialogopen}
                    onClose={() => { setIsDialogOpen(false); }}
                />
            </div>
        </>
    );
};

export default EventButtonComp;
