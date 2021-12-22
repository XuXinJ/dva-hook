interface Model {
    state: object;
    effects: any;
    reducers: any;
    namespace: string;
}
declare const dvaHook: <T extends Model>(modelParmas: T) => {
    useBind: () => {
        Ef: { [key in keyof T["effects"]]: Function; };
    } & T["state"];
    useMdState: (F: (S: T["state"]) => any) => any;
};
export default dvaHook;
