import { ENV } from "@/shared/config/env.config";
import { Group, mapGroup } from "@/shared/models/common/group.model";
import { Lesson, LessonGroup, mapLessonGroup, mapLesson } from "@/shared/models/common/lesson.model";
import { LessonType, mapLessonType } from "@/shared/models/common/lessonType.model";
import { Building, Location, mapLocation, mapBuilding } from "@/shared/models/common/location.model";

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

export async function getAllRooms(_token: string): Promise<Location[]> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODk4OTY5LCJleHAiOjE3NjI5MjA1NjksImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjEifQ.hUuActDWjS8rWCP-TwcJXxGLWk5YO0gxrw1gyra1v6esETqKHdzMmfosITr1mbUT8ouhHHQuSFbP33P3ZYsz2g";  // eslint-disable-line
    const response = await fetch(
        `${ENV.api_url}/room/all`,
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

        return data.map((loc: any) => { // eslint-disable-line
            return mapLocation(loc);
        });
    }

    return [];
}

export async function getAllBuildings(_token: string): Promise<Building[]> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODk4OTY5LCJleHAiOjE3NjI5MjA1NjksImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjEifQ.hUuActDWjS8rWCP-TwcJXxGLWk5YO0gxrw1gyra1v6esETqKHdzMmfosITr1mbUT8ouhHHQuSFbP33P3ZYsz2g";  // eslint-disable-line
    const response = await fetch(
        `${ENV.api_url}/building/all`,
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

        return data.map((bld: any) => { // eslint-disable-line
            return mapBuilding(bld);
        });
    }

    return [];
}

export async function addRoom(_token: string, building_id: number, room: string, description: string, capacity: number): Promise<Location | null> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODk4OTY5LCJleHAiOjE3NjI5MjA1NjksImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjEifQ.hUuActDWjS8rWCP-TwcJXxGLWk5YO0gxrw1gyra1v6esETqKHdzMmfosITr1mbUT8ouhHHQuSFbP33P3ZYsz2g";  // eslint-disable-line
    const response = await fetch(
        `${ENV.api_url}/room/create`,
        {
            method : "POST",
            headers: {
                Authorization : `Bearer ${token}`, // eslint-disable-line
                "Content-Type": "application/json", // eslint-disable-line
            },
            body: JSON.stringify({
                capacity   : capacity,
                description: description,
                name       : room,
                building_id: building_id,
            }),
        },
    );

    if (response.ok) {
        const data = await response.json(); // eslint-disable-line

        return mapLocation(data);
    }

    return null;
}

export async function addRoomNewBuilding(_token: string, building_name: string, room: string, description: string, capacity: number): Promise<Location | null> { // eslint-disable-line
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODk4OTY5LCJleHAiOjE3NjI5MjA1NjksImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjEifQ.hUuActDWjS8rWCP-TwcJXxGLWk5YO0gxrw1gyra1v6esETqKHdzMmfosITr1mbUT8ouhHHQuSFbP33P3ZYsz2g";  // eslint-disable-line
    const response = await fetch(
        `${ENV.api_url}/building/create`,
        {
            method : "POST",
            headers: {
                Authorization : `Bearer ${token}`, // eslint-disable-line
                "Content-Type": "application/json", // eslint-disable-line
            },
            body: JSON.stringify({
                description: "",
                name       : building_name,
            }),
        },
    );

    if (response.ok) {
        const buildingData = await response.json(); // eslint-disable-line

        const building = mapBuilding(buildingData);

        return addRoom(_token, building.id, room, description, capacity);
    }

    return null;
}

export async function deleteRoomById(_token: string, room_id: number): Promise<void> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODk4OTY5LCJleHAiOjE3NjI5MjA1NjksImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjEifQ.hUuActDWjS8rWCP-TwcJXxGLWk5YO0gxrw1gyra1v6esETqKHdzMmfosITr1mbUT8ouhHHQuSFbP33P3ZYsz2g";  // eslint-disable-line
    
    await fetch(
        `${ENV.api_url}/room/delete/${room_id.toString()}`,
        {
            method : "DELETE",
            headers: {
                Authorization : `Bearer ${token}`, // eslint-disable-line
                "Content-Type": "application/json", // eslint-disable-line
            },
        },
    );
}

export async function updateRoom(_token: string, room_id: number, name: string, description: string, capacity: number): Promise<void> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODk4OTY5LCJleHAiOjE3NjI5MjA1NjksImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjEifQ.hUuActDWjS8rWCP-TwcJXxGLWk5YO0gxrw1gyra1v6esETqKHdzMmfosITr1mbUT8ouhHHQuSFbP33P3ZYsz2g";  // eslint-disable-line
    
    await fetch(
        `${ENV.api_url}/room/name`,
        {
            method : "PATCH",
            headers: {
                Authorization : `Bearer ${token}`, // eslint-disable-line
                "Content-Type": "application/json", // eslint-disable-line
            },
            body: JSON.stringify({
                new_name: name,
                room_id : room_id,
            }),
        },
    );
    
    await fetch(
        `${ENV.api_url}/room/description`,
        {
            method : "PATCH",
            headers: {
                Authorization : `Bearer ${token}`, // eslint-disable-line
                "Content-Type": "application/json", // eslint-disable-line
            },
            body: JSON.stringify({
                new_description: description,
                room_id        : room_id,
            }),
        },
    );

    await fetch(
        `${ENV.api_url}/room/capacity`,
        {
            method : "PATCH",
            headers: {
                Authorization : `Bearer ${token}`, // eslint-disable-line
                "Content-Type": "application/json", // eslint-disable-line
            },
            body: JSON.stringify({
                new_capacity: capacity,
                room_id     : room_id,
            }),
        },
    );


    return;
}

export async function getLessonType(_token:string): Promise<LessonType[]> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODk4OTY5LCJleHAiOjE3NjI5MjA1NjksImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjEifQ.hUuActDWjS8rWCP-TwcJXxGLWk5YO0gxrw1gyra1v6esETqKHdzMmfosITr1mbUT8ouhHHQuSFbP33P3ZYsz2g"; // eslint-disable-line
    const response = await fetch(
        `${ENV.api_url}/lesson_type/all`,
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

        return data.map((lt: any) => { // eslint-disable-line
            const lessonType = { id: lt.id, name: lt.name, description: lt.description };  // eslint-disable-line
            return mapLessonType(lessonType); }); // eslint-disable-line
    }

    return [];
}

export async function getLessonsByGroupId(_token:string, group_id:number): Promise<LessonGroup[]> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODk4OTY5LCJleHAiOjE3NjI5MjA1NjksImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjEifQ.hUuActDWjS8rWCP-TwcJXxGLWk5YO0gxrw1gyra1v6esETqKHdzMmfosITr1mbUT8ouhHHQuSFbP33P3ZYsz2g"; // eslint-disable-line
    const response = await fetch(
        `${ENV.api_url}/group/link/${group_id.toString()}/lesson`,
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

        return data.map((lt: any) => { // eslint-disable-line
            const lessonGroup = { lesson_args: lt.lesson_args, lesson_type_id: lt.lesson_type_id, lesson_id: lt.lesson_id };  // eslint-disable-line
            return mapLessonGroup(lessonGroup); }); // eslint-disable-line
    }

    return [];
}

export async function getLessonById(_token:string, lesson_id:number): Promise<Lesson | null> {
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODk4OTY5LCJleHAiOjE3NjI5MjA1NjksImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjEifQ.hUuActDWjS8rWCP-TwcJXxGLWk5YO0gxrw1gyra1v6esETqKHdzMmfosITr1mbUT8ouhHHQuSFbP33P3ZYsz2g"; // eslint-disable-line
    const response = await fetch(
        `${ENV.api_url}/lesson/id/${lesson_id.toString()}`,
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

        return mapLesson(data);
    }

    return null;
}

export async function getLessons(_token:string): Promise<Lesson[]> {
    // eslint-disable-next-line @stylistic/max-len
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODk4OTY5LCJleHAiOjE3NjI5MjA1NjksImF1ZCI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsImlzcyI6ImFwaS5wb2x5aHViLm1lczRnYW1lLmNvbSIsInN1YiI6IjEifQ.hUuActDWjS8rWCP-TwcJXxGLWk5YO0gxrw1gyra1v6esETqKHdzMmfosITr1mbUT8ouhHHQuSFbP33P3ZYsz2g";
    const response = await fetch(
        `${ENV.api_url}/lesson/all`,
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

        return data.map((lt: any) => { // eslint-disable-line
            const lesson = { id: lt.id, name: lt.name, description: lt.description };  // eslint-disable-line
            return mapLesson(lesson); }); // eslint-disable-line
    }

    return [];
}
