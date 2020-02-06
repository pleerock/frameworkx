import { createApp } from "@microframework/core";
import { PersonIntersectionType } from "../model/PersonIntersectionType";

export const App = createApp<{
    models: {
        PersonIntersectionType: PersonIntersectionType,
    },
}>()
