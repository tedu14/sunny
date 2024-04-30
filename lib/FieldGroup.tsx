import React, { createContext, PropsWithChildren, useContext } from "react";
import { isEmpty } from "./utils";

type Context = {
    path: string;
};

const GroupContext = createContext({} as Context);

type Props = Pick<Context, "path">;

export function FieldGroup({ path, children }: PropsWithChildren<Props>) {
    const context = useContext(GroupContext);

    return (
        <GroupContext.Provider
            value={{
                path: isEmpty(context.path) ? path : `${context.path}.${path}`,
            }}
        >
            {children}
        </GroupContext.Provider>
    );
}

export function useGroup() {
    const context = useContext(GroupContext);

    if (!context) {
        return {
            path: "",
        };
    }

    return context;
}
