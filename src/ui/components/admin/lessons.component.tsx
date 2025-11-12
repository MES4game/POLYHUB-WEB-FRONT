import { FC, ReactNode, useEffect, useState } from "react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from "#/components/ui/item";
import { Button } from "#/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Dialog, DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { Lesson } from "@/shared/models/common/lesson.model";
import { getLessons } from "@/api/admin.api";
import { useGeneralVars } from "@/shared/contexts/common/general.context";

const LessonsComp : FC = (): ReactNode => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const { token } = useGeneralVars();
    
    const { register, handleSubmit, reset } = useForm<IFormInput>();
    const { register: registerEdit, handleSubmit: handleEditSubmit, reset: resetEdit } = useForm<IFormInput>();

    useEffect(() => {
        console.log("Loaded: LessonsComp");
        
        getLessons(token.current).then((lessons) => {
            setLessons(lessons);
        })
            .catch((error: unknown) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        console.log("Rendered: LessonsComp");
    });

    const deleteLesson = (index: number) => {
        // toDo call API to delete room
        lessons.splice(index, 1);
        setLessons([...lessons]);
    };

    interface IFormInput {
        name       : string;
        description: string;
    }

    const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput) => {
        // toDo call API to add lesson
        const new_lesson: Lesson = {
            id         : lessons.length + 1,
            name       : data.name,
            description: data.description,
        };
        setLessons([...lessons, new_lesson]);
        reset();
    };

    const onEditSubmit = (data: IFormInput, index: number) => {
        // toDo call API to edit lesson
        const lesson_to_edit = lessons[index];
        if (!lesson_to_edit) return;
        const edited_lesson: Lesson = {
            id         : lesson_to_edit.id,
            name       : data.name,
            description: data.description,
        };
        lessons[index] = edited_lesson;
        setLessons([...lessons]);
        resetEdit();
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
                }).map((lesson: Lesson, index: number) => {
                    return (
                        <div key={index}>
                            <Item className="h-fit">
                                <ItemContent>
                                    <ItemTitle>{lesson.id}. {lesson.name}</ItemTitle>
                                    
                                    <ItemDescription className="whitespace-pre-line break-words truncate-none line-clamp-none">
                                        {lesson.description}
                                    </ItemDescription>
                                </ItemContent>

                                <ItemActions>
                                    <Dialog onOpenChange={(open) => {
                                        if (open) {
                                            // when opening the edit dialog, reset the edit form with the current room values
                                            reset();
                                        }
                                    }}
                                    >
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Edit />
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Modifier la leçon</DialogTitle>
                                            </DialogHeader>

                                            <div className="flex flex-col gap-4 mt-4">
                                                <form onSubmit={(e) => { void handleEditSubmit((data) => { onEditSubmit(data, index); })(e); }}>
                                                    <Label>Nom</Label>

                                                    <Input
                                                        type="text"
                                                        {...registerEdit("name", { required: true })}
                                                        defaultValue={lesson.name}
                                                        placeholder="Nom de la leçon"
                                                    />

                                                    <Label>Description</Label>
                                                    <br />

                                                    <textarea
                                                        className="w-full border rounded"
                                                        {...registerEdit("description", { required: true })}
                                                        defaultValue={lesson.description}
                                                        placeholder="Description"
                                                    />

                                                    <DialogClose asChild>
                                                        <Button type="submit">Enregistrer</Button>
                                                    </DialogClose>

                                                    <DialogClose asChild>
                                                        <Button variant="outline">Annuler</Button>
                                                    </DialogClose>
                                                </form>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Trash2 />
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Supprimer la leçon</DialogTitle>
                                                <DialogDescription>Cette action est irréversible.</DialogDescription>
                                            </DialogHeader>

                                            <div className="flex flex-col gap-4 mt-4">
                                                <DialogClose asChild>
                                                    <Button variant="destructive" onClick={() => { deleteLesson(index); }}>Supprimer</Button>
                                                </DialogClose>

                                                <DialogClose asChild>
                                                    <Button variant="outline">Annuler</Button>
                                                </DialogClose>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </ItemActions>
                            </Item>

                            {index !== lessons.length - 1 && <ItemSeparator />}
                        </div>
                    );
                })}
            </ItemGroup>
        </div>
    );
};

export default LessonsComp;
