import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
    reducerPath: "main", // name for the api calls doesnt matter really just a name
    tagTypes: ["Kpis"], // used to keep info
    endpoints: (build) => ({
        getKpis: build.query({
            query: () => "kpi/kpis/",
            providesTags: ["Kpis"],
        }),
    }),
});
