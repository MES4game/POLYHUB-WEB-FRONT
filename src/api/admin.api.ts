import { ENV } from "@/shared/config/env.config";
import { Group, mapGroup } from "@/shared/models/common/group.model";

export async function getAllGroups(_token: string): Promise<Group[]> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODk4OTY5LCJleHAiOjE3NjI5MjA1NjksImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjEifQ.hUuActDWjS8rWCP-TwcJXxGLWk5YO0gxrw1gyra1v6esETqKHdzMmfosITr1mbUT8ouhHHQuSFbP33P3ZYsz2g";  // eslint-disable-line
    const response = await fetch(
        `${ENV.api_url}/group/all`,
        {
            method : "GET",
            headers: {
                Authorization : `Bearer ${token}`, // eslint-disable-line
                "Content-Type": "application/json", // eslint-disable-line
            },
        },
    );

    if (response.ok) {
        const data = await response.json(); // eslint-disable-line

        return data.map((g: any) => { // eslint-disable-line
            const group = { id: g.id, parentId: g.parent_id, name: g.name, description: g.description };  // eslint-disable-line
            return mapGroup(group); }); // eslint-disable-line
    }

    return [];
}

export async function deleteGroupById(_token: string, group_id: number): Promise<void> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODk4OTY5LCJleHAiOjE3NjI5MjA1NjksImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjEifQ.hUuActDWjS8rWCP-TwcJXxGLWk5YO0gxrw1gyra1v6esETqKHdzMmfosITr1mbUT8ouhHHQuSFbP33P3ZYsz2g";  // eslint-disable-line
    
    await fetch(
        `${ENV.api_url}/group/delete/${group_id.toString()}`,
        {
            method : "DELETE",
            headers: {
                Authorization : `Bearer ${token}`, // eslint-disable-line
                "Content-Type": "application/json", // eslint-disable-line
            },
        },
    );
}

export async function addGroup(_token: string, parent_id: number | null, name: string, description: string): Promise<Group | null> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODk4OTY5LCJleHAiOjE3NjI5MjA1NjksImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjEifQ.hUuActDWjS8rWCP-TwcJXxGLWk5YO0gxrw1gyra1v6esETqKHdzMmfosITr1mbUT8ouhHHQuSFbP33P3ZYsz2g";  // eslint-disable-line
    const response = await fetch(
        `${ENV.api_url}/group/create`,
        {
            method : "POST",
            headers: {
                Authorization : `Bearer ${token}`, // eslint-disable-line
                "Content-Type": "application/json", // eslint-disable-line
            },
            body: JSON.stringify({
                description: description,
                name       : name,
                parent_id  : parent_id,
            }),
        },
    );

    if (response.ok) {
        const data = await response.json(); // eslint-disable-line
        const group = { id: data.id, parentId: data.parent_id, name: data.name, description: data.description };  // eslint-disable-line
        return mapGroup(group); // eslint-disable-line
    }
    else {
        const error = await response.json(); // eslint-disable-line

        console.error(error);
    }

    return null;
}

export async function updateGroup(_token: string, group_id: number, name: string, description: string): Promise<void> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODk4OTY5LCJleHAiOjE3NjI5MjA1NjksImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjEifQ.hUuActDWjS8rWCP-TwcJXxGLWk5YO0gxrw1gyra1v6esETqKHdzMmfosITr1mbUT8ouhHHQuSFbP33P3ZYsz2g";  // eslint-disable-line
    
    await fetch(
        `${ENV.api_url}/group/name`,
        {
            method : "PATCH",
            headers: {
                Authorization : `Bearer ${token}`, // eslint-disable-line
                "Content-Type": "application/json", // eslint-disable-line
            },
            body: JSON.stringify({
                new_name: name,
                group_id: group_id,
            }),
        },
    );

    await fetch(
        `${ENV.api_url}/group/description`,
        {
            method : "PATCH",
            headers: {
                Authorization : `Bearer ${token}`, // eslint-disable-line
                "Content-Type": "application/json", // eslint-disable-line
            },
            body: JSON.stringify({
                new_description: description,
                group_id       : group_id,
            }),
        },
    );

    return;
}
