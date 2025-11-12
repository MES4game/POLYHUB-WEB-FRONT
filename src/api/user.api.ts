import { User, mapUser } from "@/shared/models/user.model";
import { ENV } from "@/shared/config/env.config";

export async function getSelf(token: string): Promise<User> {
    const response = await fetch(
        `${ENV.api_url}/user/self`,
        {
            method : "GET",
            headers: {
                Authorization : `Bearer ${token}`, // eslint-disable-line
                "Content-Type": "application/json", // eslint-disable-line
            },
        },
    );

    if (response.ok) {
        const data: User = await response.json(); // eslint-disable-line

        return mapUser(data);
    }

    throw new ReferenceError("Failed to fetch self user data");
}

export async function getSelfIsAdmin(token: string): Promise<boolean> {
    const id = (await getSelf(token)).id;
    const response = await fetch(
        `${ENV.api_url}/user/admin/${id.toString()}`,
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

export async function getSelfIsModo(token: string): Promise<boolean> {
    const id = (await getSelf(token)).id;
    const response = await getIsModo(token, id);

    return response;
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

export async function setIsTeacher(token: string, user_id: number, is_teacher: boolean): Promise<void> {
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

export async function setIsModo(token: string, user_id: number, is_moderator: boolean): Promise<void> {
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

export async function getAllUsers(token: string): Promise<User[]> {
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
        const error_data = await response.json() as { message?: string };

        throw new Error(error_data.message ?? "Login failed");
    }

    const data = await response.json() as { token?: string };

    return { token: data.token ?? "" };
}

export async function registerUser(pseudo: string, email: string, firstname: string, lastname: string, password: string): Promise<void> {
    const response = await fetch(
        `${ENV.api_url}/auth/register`,
        {
            method : "POST",
            headers: {
                "Content-Type": "application/json", // eslint-disable-line
            },
            body: JSON.stringify({
                pseudo   : pseudo,
                email    : email,
                firstname: firstname,
                lastname : lastname,
                password : password,
            }),
        },
    );
    
    if (!response.ok) {
        const error_data = await response.json() as { message?: string };

        throw new Error(error_data.message ?? "Registration failed");
    }

    return;
}

export async function getAllTeachers(token: string): Promise<User[]> {
    const all_users = await getAllUsers(token);
    
    const teachers = await Promise.all(
        all_users.map(async (user) => {
            const is_teacher = await getIsTeacher(token, user.id);

            return { user, is_teacher };
        }),
    );
    
    return teachers
        .filter(({ is_teacher }) => {
            return is_teacher;
        })
        .map(({ user }) => {
            return user;
        });
}
