import { FC, ReactNode } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "#/components/ui/dialog";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

// import { Calendar } from "#/components/ui/calendar";
import "@/ui/components/home/sidebar/event/eventDialog.component.css";

interface EventDialogProps {
    isopen : boolean;
    onClose: () => void;
}

export const EventDialogComp: FC<EventDialogProps> = ({ isopen, onClose }): ReactNode => {
    // const [date, setDate] = useState<Date | undefined>(new Date());
    // const [selectedTime, setSelectedTime] = useState<string>("10:00");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // // Add your event creation logic here
        // console.log("Event created", { date, time: selectedTime });
        onClose();
    };

    return (
        <Dialog open={isopen} onOpenChange={onClose}>
            <DialogContent className="event-dialog">
                <DialogHeader>

                    <DialogTitle>Nouvel Evenement</DialogTitle>
                    <DialogDescription>Remplissez les détails pour créer un nouvel événement</DialogDescription>

                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="event-title">Nom de l'événement</Label>

                        <Input
                            id="event-title"
                            placeholder="Entrez le nom de l'événement"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="event-description">Lieu</Label>

                        <Input
                            id="event-description"
                            placeholder="Entrez le lieu de l'événement"
                        />
                    </div>


                    <DialogFooter className="pt-4 gap-3">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="w-full sm:w-auto">
                                Annuler
                            </Button>
                        </DialogClose>

                        <Button type="submit" className="w-full sm:w-auto">
                            Valider
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
