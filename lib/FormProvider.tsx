import React, { useContext, useImperativeHandle } from "react";
import { forwardRef, PropsWithChildren, useRef } from "react";
import dot from "dot-object";

import { Data, Field, FormRef } from "./types";
import { FormContext } from "./context";
import { flattenObject, isArrayEmpty } from "./utils";

type Props = {
    initialData?: Data;
    onSubmit?: (data: Data) => void;
};

export const FormProvider = forwardRef<FormRef, PropsWithChildren<Props>>(
    function El({ children, initialData, onSubmit }, ref) {
        const fields = useRef(new Map<string, Field<unknown>>());

        function registerField(name: string, field: Field<unknown>) {
            fields.current.set(name, field);
        }

        function unregisterField(name: string) {
            fields.current.delete(name);
        }

        function getData(fieldsName?: string[]) {
            const data: Data = {};

            if (!isArrayEmpty(fieldsName)) {
                fieldsName?.forEach((name) => {
                    const field = fields.current.get(name);

                    if (field) {
                        data[name] = field.getValue();
                    }
                });

                dot.object(data);

                return data;
            }

            fields.current.forEach((field, name) => {
                data[name] = field.getValue();
            });

            dot.object(data);

            return data;
        }

        function setData(data: Partial<Data>) {
            Object.entries(flattenObject(data)).forEach(([name, value]) => {
                const field = fields.current.get(name);

                if (field) {
                    field.setValue(value);
                }
            });
        }

        function isValidField(name: string) {
            const field = fields.current.get(name);

            if (field) {
                return field.isValid();
            }

            return false;
        }

        function validateField(name: string) {
            const field = fields.current.get(name);
            if (field) {
                field.validate();
            }
        }

        function isValid(fieldsName?: string[]) {
            if (!isArrayEmpty(fieldsName))
                return fieldsName?.every(isValidField);

            return Array.from(fields.current.keys()).every(isValidField);
        }

        function validate(fieldsName?: string[]) {
            if (!isArrayEmpty(fieldsName)) fieldsName?.forEach(validateField);
            else fields.current.forEach((_, name) => validateField(name));
        }

        function reset() {
            fields.current.forEach((field) => field.reset());
        }

        function clearErrors(fieldsName?: string[]) {
            if (!isArrayEmpty(fieldsName)) {
                fieldsName?.forEach((name) => {
                    const field = fields.current.get(name);

                    if (field) {
                        field.setError(undefined);
                    }
                });

                return;
            }

            fields.current.forEach((field) => field.setError(undefined));
        }

        function setErrors(errors: Record<string, string | undefined>) {
            Object.entries(errors).forEach(([name, error]) => {
                const field = fields.current.get(name);

                if (field) {
                    field.setError(error);
                }
            });
        }

        function getErrors(fieldsName?: string[]) {
            const errors: Record<string, string | undefined> = {};

            if (!isArrayEmpty(fieldsName)) {
                fieldsName?.forEach((name) => {
                    const field = fields.current.get(name);

                    if (field) {
                        errors[name] = field.getError();
                    }
                });

                return errors;
            }

            fields.current.forEach((field, name) => {
                errors[name] = field.getError();
            });

            return errors;
        }

        function setFieldValue(name: string, value: unknown) {
            const field = fields.current.get(name);

            if (field) {
                field.setValue(value);
            }
        }

        function setFieldError(name: string, error: string) {
            const field = fields.current.get(name);

            if (field) {
                field.setError(error);
            }
        }

        function getFieldValue(name: string) {
            const field = fields.current.get(name);

            if (field) {
                return field.getValue();
            }

            return undefined;
        }

        function clearFieldError(name: string) {
            const field = fields.current.get(name);

            if (field) {
                field.setError(undefined);
            }
        }

        function submit() {
            validate();

            if (isValid()) {
                onSubmit?.(getData());
            }
        }

        const formRef: FormRef = {
            getData,
            setData,
            isValid(fieldsName?: string[]) {
                return !!isValid(fieldsName);
            },
            validate,
            reset,
            clearErrors,
            setErrors,
            getErrors,
            setFieldValue,
            setFieldError,
            validateField,
            isValidField,
            getFieldValue,
            clearFieldError,
            submit,
        };

        useImperativeHandle(ref, () => formRef, [formRef]);

        return (
            <FormContext.Provider
                value={{
                    initialData: initialData || {},
                    registerField,
                    unregisterField,
                    formRef,
                }}
            >
                {children}
            </FormContext.Provider>
        );
    }
);

export function useForm() {
    const context = useContext(FormContext);

    if (!context) {
        throw new Error("useForm must be used within a FormProvider");
    }

    return context;
}
