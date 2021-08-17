import {MediaFile} from "../../services/MediaManager/MediaManager";

export type EventTypes = "add" | "delete";

export type MediaEvent = {
    type: EventTypes,
    payload: MediaFile
}

export const createEvent = (type: EventTypes) => (media: MediaFile) => ({
    type: type,
    payload: media
})

export const createAddEvent = createEvent("add");

export const createDeleteEvent = createEvent("delete");

type Handlers<T> = {
    [key in EventTypes]: (m: MediaFile) => T
}

export const createHandler = <T>(handlers: Handlers<T>) => (event: MediaEvent) : T => {
    return handlers[event.type](event.payload)
}