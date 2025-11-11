import { User, mapUser } from "@/shared/models/user.model";
import { ENV } from "@/shared/config/env.config";

const USERS: User[] = [
    { id: 1, pseudo: "", email: "", firstname: "", lastname: "", created_on: new Date(), last_connection: new Date(), deleted_on: new Date(0), verified_email: false }, // eslint-disable-line
    { id: 2, pseudo: "", email: "", firstname: "", lastname: "", created_on: new Date(), last_connection: new Date(), deleted_on: new Date(0), verified_email: false }, // eslint-disable-line
    { id: 3, pseudo: "", email: "", firstname: "", lastname: "", created_on: new Date(), last_connection: new Date(), deleted_on: new Date(0), verified_email: false }, // eslint-disable-line
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
        `${ENV.api_url}/user/teacher/${user_id.toString()}`,
        {
            method : "GET",
            headers: {
                Authorization : `Bearer ${token}`, // eslint-disable-line
                "Content-Type": "application/json", // eslint-disable-line
            },
        },
    );

    if (response.ok) {
        const { is_role } = await response.json(); // eslint-disable-line

        return is_role; // eslint-disable-line
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
        `${ENV.api_url}/user/moderator/${user_id.toString()}`,
        {
            method : "GET",
            headers: {
                Authorization : `Bearer ${token}`, // eslint-disable-line
                "Content-Type": "application/json", // eslint-disable-line
            },
        },
    );

    if (response.ok) {
        const { is_role } = await response.json(); // eslint-disable-line

        return is_role; // eslint-disable-line
    }

    return false;
}

export async function setIsModo(_user_id: number, _is_moderator: boolean): Promise<void> {
    // Just to remove error from linter of no await inside an async function
    await fetch("https://data.bde-pps.fr/bde/images/logo/bde.svg");

    return;
}

export async function getAllUsers(_token: string): Promise<User[]> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzYyODgyMjI2LCJleHAiOjE3NjI5MDM4MjYsImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjMifQ.bI0-zXa50wOLJG0JavKkfb-5wWqmb27ejogyGKGYos4H_ZEysBaUyliGZIk6BuXkaKfF6hEwYeh6I5V4KgxiEQ"; // eslint-disable-line
    const response = await fetch(
        `${ENV.api_url}/user/all`,
        {
            method : "GET",
            headers: {
                Authorization : `Bearer ${token}`, // eslint-disable-line
                "Content-Type": "application/json", // eslint-disable-line
            },
        },
    );

    if (response.ok) {
        const data: User[] = await response.json(); // eslint-disable-line

        return data.map((user: User) => {
            return mapUser(user);
        });
    }

    return [];
}
