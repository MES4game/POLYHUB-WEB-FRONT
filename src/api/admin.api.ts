import { ENV } from "@/shared/config/env.config";
import { Group, mapGroup } from "@/shared/models/common/group.model";
import { Building, Location, mapLocation, mapBuilding } from "@/shared/models/common/location.model";

export async function getAllGroups(token: string): Promise<Group[]> {
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

export async function deleteGroupById(token: string, group_id: number): Promise<void> {
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

export async function addGroup(token: string, parent_id: number | null, name: string, description: string): Promise<Group | null> {
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

export async function updateGroup(token: string, group_id: number, name: string, description: string): Promise<void> {
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

export async function getAllRooms(token: string): Promise<Location[]> {
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

export async function getAllBuildings(token: string): Promise<Building[]> {
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

export async function addRoom(token: string, building_id: number, room: string, description: string, capacity: number): Promise<Location | null> {
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

export async function addRoomNewBuilding(token: string, building_name: string, room: string, description: string, capacity: number): Promise<Location | null> { // eslint-disable-line
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

        return addRoom(token, building.id, room, description, capacity);
    }

    return null;
}

export async function deleteRoomById(token: string, room_id: number): Promise<void> {
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

export async function updateRoom(token: string, room_id: number, name: string, description: string, capacity: number): Promise<void> {
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
