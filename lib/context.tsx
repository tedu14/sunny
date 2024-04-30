import { createContext } from "react";
import { Field, FormRef } from "./types";

type Props = {
    registerField: (name: string, field: Field<unknown>) => void;
    unregisterField: (name: string) => void;
    initialData: Record<string, unknown>;
    formRef: FormRef;
};

export const FormContext = createContext({} as Props);
