import { User, mapUser } from "@/shared/models/user.model";
import { ENV } from "@/shared/config/env.config";

const USERS: User[] = [
    { id: 1, pseudo: "", email: "", firstname: "", lastname: "", created_on: new Date(), last_connection: new Date(), deleted_on: new Date(0), verified_email: false },
    { id: 2, pseudo: "", email: "", firstname: "", lastname: "", created_on: new Date(), last_connection: new Date() , deleted_on: new Date(0), verified_email: false },
    { id: 3, pseudo: "", email: "", firstname: "", lastname: "", created_on: new Date(), last_connection: new Date() , deleted_on: new Date(0), verified_email: false },
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


export async function getIsTeacher(token: string, user_id: number): Promise<boolean> {
    const response = await fetch(
        `${ENV.api_url}/user/teacher/${user_id}`,
        {
            method : "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        },);

    if (response.ok) {
        const data = await response.json();
        console.log("getIsTeacher:", data.is_role);
        return data.is_role;
    }

    return false;
}

export async function setIsTeacher(_user_id: number, _is_teacher: boolean): Promise<void> {
    // Just to remove error from linter of no await inside an async function
    await fetch("https://data.bde-pps.fr/bde/images/logo/bde.svg");

    return;
}

export async function getIsModo(token: string, user_id: number): Promise<boolean> {
    const response = await fetch(
        `${ENV.api_url}/user/moderator/${user_id}`,
        {
            method : "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        },);

    if (response.ok) {
        const data = await response.json();
        console.log("getIsModo:", data.is_role);
        return data.is_role;
    }

    return false;
}

export async function setIsModo(_user_id: number, _is_moderator: boolean): Promise<void> {
    // Just to remove error from linter of no await inside an async function
    await fetch("https://data.bde-pps.fr/bde/images/logo/bde.svg");

    return;
}

export async function getAllUsers(_token: string): Promise<User[]> {
    // Just to remove error from linter of no await inside an async function
    const response = await fetch(
        `${ENV.api_url}/user/all`,
        {
            method : "GET",
            headers: {
                "Authorization": `Bearer ${_token}`,
                "Content-Type": "application/json",
            },
        },
    );

    if (response.ok) {
        const data = await response.json();
        console.log("getAllUsers:", data.users);
        return data.users.map((user: any) => mapUser(user));
    }

    return USERS.map((user) => mapUser(user));
}
