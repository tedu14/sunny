import { RefObject, useEffect, useRef, useState } from "react";
import { Field, FieldMask, FieldRule } from "./types";
import { isArrayEmpty, isFunction } from "./utils";
import { useForm } from "./FormProvider";
import { useGroup } from "./FieldGroup";

type InputRef = RefObject<HTMLInputElement>;

type Props<T> = {
    name: string;
    rules?: FieldRule<T>[];
    mask?: FieldMask<T>;
    setValue?: (value: T, ref: InputRef) => void;
    getValue?: (ref: InputRef) => T;
    clear?: () => void;
};

export function useField<T>({
    name,
    clear,
    getValue: overrideGetValue,
    setValue: overrideSetValue,
    mask,
    rules,
}: Props<T>) {
    const [error, setStateError] = useState<string | undefined>();

    const ref = useRef<HTMLInputElement>(null);

    const { registerField } = useForm();
    const { path } = useGroup();

    const fieldName = path ? `${path}.${name}` : name;

    function getFieldValue() {
        if (isFunction(overrideGetValue)) {
            return overrideGetValue(ref);
        }

        return ref.current?.value as T;
    }

    function setFieldValue(value: T) {
        if (isFunction(overrideSetValue)) {
            overrideSetValue(value, ref);
            return;
        }
        ref.current!.value = String(isFunction(mask) ? mask(value) : value);
    }

    function clearFieldValue() {
        if (isFunction(clear)) {
            clear();
            return;
        }
        ref.current!.value = "";
    }

    function getValue() {
        const value = getFieldValue();
        return isFunction(mask) ? mask(value) : value;
    }

    function setValue(value: T) {
        setFieldValue(value);
    }

    function getError() {
        return error;
    }

    function setError(error: string | undefined) {
        setStateError(error);
    }

    function isValid() {
        if (isArrayEmpty(rules)) {
            return true;
        }
        return rules!.every((rule) => !rule(getValue()));
    }

    function validate() {
        const error = rules!.map((rule) => rule(getValue())).find(Boolean);
        setStateError(error);
    }

    function clearError() {
        setStateError(undefined);
    }

    function reset() {
        clearFieldValue();
        clearError();
    }

    const field: Field<T> = {
        name: fieldName,
        getValue,
        setValue,
        getError,
        setError,
        isValid,
        validate,
        reset,
    };

    useEffect(() => {
        registerField(fieldName, field as Field<unknown>);
    }, [field, fieldName]);

    return {
        fieldRef: ref,
        clearError,
        error,
        isValid,
        validate,
        reset,
        fieldName,
    };
}
