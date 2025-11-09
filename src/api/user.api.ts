import { User, mapUser } from "@/shared/models/user.model";

const USERS: User[] = [
    { id: 1, pseudo: "", email: "", firstname: "", lastname: "", created_on: new Date(), last_connection: new Date() },
    { id: 2, pseudo: "", email: "", firstname: "", lastname: "", created_on: new Date(), last_connection: new Date() },
    { id: 3, pseudo: "", email: "", firstname: "", lastname: "", created_on: new Date(), last_connection: new Date() },
];

export async function getSelf(_token: string): Promise<User> {
    // Just to remove error from linter of no await inside an async function
    await fetch("https://data.bde-pps.fr/bde/images/logo/bde.svg");

    return mapUser(USERS[0]);
}

export async function getSelfIsAdmin(_token: string): Promise<boolean> {
    // Just to remove error from linter of no await inside an async function
    await fetch("https://data.bde-pps.fr/bde/images/logo/bde.svg");

    return true;
}

export async function getSelfIsModo(_token: string): Promise<boolean> {
    // Just to remove error from linter of no await inside an async function
    await fetch("https://data.bde-pps.fr/bde/images/logo/bde.svg");

    return true;
}


export async function getIsTeacher(user_id: number): Promise<boolean> {
    // Just to remove error from linter of no await inside an async function
    await fetch("https://data.bde-pps.fr/bde/images/logo/bde.svg");

    return user_id % 2 === 0;
}

export async function setIsTeacher(_user_id: number, _is_teacher: boolean): Promise<void> {
    // Just to remove error from linter of no await inside an async function
    await fetch("https://data.bde-pps.fr/bde/images/logo/bde.svg");

    return;
}

export async function getIsModo(user_id: number): Promise<boolean> {
    // Just to remove error from linter of no await inside an async function
    await fetch("https://data.bde-pps.fr/bde/images/logo/bde.svg");

    return user_id % 3 === 0;
}

export async function setIsModo(_user_id: number, _is_moderator: boolean): Promise<void> {
    // Just to remove error from linter of no await inside an async function
    await fetch("https://data.bde-pps.fr/bde/images/logo/bde.svg");

    return;
}
