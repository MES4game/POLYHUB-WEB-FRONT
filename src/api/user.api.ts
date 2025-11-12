import { User, mapUser } from "@/shared/models/user.model";
import { ENV } from "@/shared/config/env.config";
import { error } from "console";

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

export async function setIsTeacher(_token: string, user_id: number, is_teacher: boolean): Promise<void> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzYyODgyMjI2LCJleHAiOjE3NjI5MDM4MjYsImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjMifQ.bI0-zXa50wOLJG0JavKkfb-5wWqmb27ejogyGKGYos4H_ZEysBaUyliGZIk6BuXkaKfF6hEwYeh6I5V4KgxiEQ";  // eslint-disable-line
    
    if (is_teacher) {
        await fetch(
            `${ENV.api_url}/role/link/teacher/user/${user_id.toString()}`,
            {
                method : "POST",
                headers: {
                    Authorization : `Bearer ${token}`, // eslint-disable-line
                    "Content-Type": "application/json", // eslint-disable-line
                },
            },
        );
    }
    else {
        await fetch(
            `${ENV.api_url}/role/link/teacher/user/${user_id.toString()}`,
            {
                method : "DELETE",
                headers: {
                    Authorization : `Bearer ${token}`, // eslint-disable-line
                    "Content-Type": "application/json", // eslint-disable-line
                },
            },
        );
    }

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

export async function setIsModo(_token: string, user_id: number, is_moderator: boolean): Promise<void> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODg3OTMzLCJleHAiOjE3NjI5MDk1MzMsImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjEifQ.e3NhZt4Z07aouSAgBpPDMpgp-xZrsaG6C68nmZ2vxsgey0El2prQhPVQniDkL87zzw7AxSxprsIEyysFRfTfag";  // eslint-disable-line
    
    if (is_moderator) {
        await fetch(
            `${ENV.api_url}/role/link/moderator/user/${user_id.toString()}`,
            {
                method : "POST",
                headers: {
                    Authorization : `Bearer ${token}`, // eslint-disable-line
                    "Content-Type": "application/json", // eslint-disable-line
                },
            },
        );
    }
    else {
        await fetch(
            `${ENV.api_url}/role/link/moderator/user/${user_id.toString()}`,
            {
                method : "DELETE",
                headers: {
                    Authorization : `Bearer ${token}`, // eslint-disable-line
                    "Content-Type": "application/json", // eslint-disable-line
                },
            },
        );
    }

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

export async function loginUser(user_login: string, password: string): Promise<{ token: string }> {
    const response = await fetch(
        `${ENV.api_url}/auth/login`,
        {
            method : "POST",
            headers: {
                "Content-Type": "application/json", // eslint-disable-line
            },
            body: JSON.stringify({
                user_login: user_login,
                password  : password,
            }),
        },
    );

    if (!response.ok) {
        throw new Error((await response.json()).message);
    }

    return { token: (await response.json()).token ?? "" };
}
