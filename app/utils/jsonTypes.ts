export interface IJsonObject {
    [x: string]: JsonValue;
}

export interface IJsonArray extends Array<JsonValue> { }

export type JsonValue = string | number | boolean | null | IJsonArray | IJsonObject;
