import { ENV } from "@/shared/config/env.config";
import { Group, mapGroup } from "@/shared/models/common/group.model";

export async function getAllGroups(_token: string): Promise<Group[]> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzYyODgyMjI2LCJleHAiOjE3NjI5MDM4MjYsImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjMifQ.bI0-zXa50wOLJG0JavKkfb-5wWqmb27ejogyGKGYos4H_ZEysBaUyliGZIk6BuXkaKfF6hEwYeh6I5V4KgxiEQ";  // eslint-disable-line
    const response = await fetch(
        `${ENV.api_url}/groups`,
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
        console.log("getAllGroups:", data.groups); // eslint-disable-line

        return data.groups.map((group: any) => { return mapGroup(group); }); // eslint-disable-line
    }

    return [];
}
