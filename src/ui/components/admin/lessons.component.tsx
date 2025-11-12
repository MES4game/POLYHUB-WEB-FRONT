import { FC, ReactNode, useEffect, useState } from "react";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from "#/components/ui/item";
import { Button } from "#/components/ui/button";
import { Dialog, DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Lesson } from "@/shared/models/common/lesson.model";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import { getLessons, addLesson } from "@/api/admin.api";

const LessonsComp : FC = (): ReactNode => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const { token } = useGeneralVars();
    
    const { register, handleSubmit, reset } = useForm<IFormInput>();

    useEffect(() => {
        console.log("Loaded: LessonsComp");
        
        // Load lessons from API
        const loadLessons = async () => {
            try {
                const fetched_lessons = await getLessons(token.current);
                console.log("Array size after getLessons():", fetched_lessons.length);
                setLessons(fetched_lessons);
            }
            catch(error) {
                console.error("Failed to load lessons:", error);
            }
        };

        void loadLessons();
    }, [token]);

    useEffect(() => {
        console.log("Rendered: LessonsComp");
    });

    interface IFormInput {
        name       : string;
        description: string;
    }

    const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
        try {
            const new_lesson = await addLesson(token.current, data.name, data.description);

            if (new_lesson) {
                setLessons([...lessons, new_lesson]);
                reset();
            }
            else {
                alert("Échec de l'ajout de la leçon");
            }
        }
        catch(error) {
            console.error("Failed to add lesson:", error);
            alert("Échec de l'ajout de la leçon");
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="ml-1">Ajouter une leçon</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajouter une leçon</DialogTitle>
                    </DialogHeader>

                    <DialogDescription>
                        Ajouter une nouvelle leçon
                    </DialogDescription>

                    <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }}>
                        <div className="flex flex-col gap-4 mt-4">

                            <Input type="text" {...register("name", { required: true })} placeholder="Nom de la leçon" />
                            <textarea className="border rounded" {...register("description", { required: true })} placeholder="Description" />

                            <DialogClose asChild>
                                <Button type="submit">Ajouter</Button>
                            </DialogClose>

                            <DialogClose asChild>
                                <Button variant="outline">Annuler</Button>
                            </DialogClose>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <h1 className="ml-3 mt-3"><b>Gérer les leçons</b></h1>

            <ItemGroup className="gap-0 max-w-sm">
                {lessons.toSorted((a: Lesson, b: Lesson) => {
                    return a.id - b.id;
                }).map((lesson: Lesson) => {
                    const original_index = lessons.findIndex((l) => { return l.id === lesson.id; });
                    
                    return (
                        <div key={lesson.id}>
                            <Item className="h-fit">
                                <ItemContent>
                                    <ItemTitle>{lesson.id}. {lesson.name}</ItemTitle>
                                    
                                    <ItemDescription className="whitespace-pre-line break-words truncate-none line-clamp-none">
                                        {lesson.description}
                                    </ItemDescription>
                                </ItemContent>
                            </Item>

                            {original_index !== lessons.length - 1 && <ItemSeparator />}
                        </div>
                    );
                })}
            </ItemGroup>
        </div>
    );
};

export default LessonsComp;
