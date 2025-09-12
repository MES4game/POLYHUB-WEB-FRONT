export async function fetchAPI(route: string): Promise<Response> {
    return await fetch(`https://${process.env.NODE_ENV === "development" ? "dev." : "api."}${process.env.DOMAIN ?? ''}${process.env.NODE_ENV === "development" ? "/api" : ""}${route}`);
}
