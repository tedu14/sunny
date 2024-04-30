export type Data = Record<string, unknown>;

type JoinDot<T, K extends string> = K extends ""
    ? T
    : `${T extends string ? T : ""}.${K}`;

type SplitDot<S extends string> = S extends `${infer T}.${infer U}`
    ? [T, ...SplitDot<U>]
    : [S];

type GetValue<O, P extends string> = P extends `${infer K}.${infer Rest}`
    ? K extends keyof O
        ? GetValue<O[K], Rest>
        : never
    : P extends keyof O
    ? O[P]
    : never;

type NestedKeys<O, P extends string = ""> = {
    [K in keyof O]: O[K] extends Data
        ? NestedKeys<O[K], JoinDot<K & string, P>>
        : JoinDot<K & string, P>;
};

export type KeyData<D> = keyof NestedKeys<D>;

export type FormRef<D = Data> = {
    getData: (fields?: KeyData<D>[]) => D;
    setData: (data: Partial<D>) => void;
    isValid: (fields?: KeyData<D>[]) => boolean;
    validate: (fields?: KeyData<D>[]) => void;
    reset: () => void;
    clearErrors: (fields?: KeyData<D>[]) => void;
    setErrors: (errors: Record<KeyData<D>, string | undefined>) => void;
    getErrors: (
        fields?: KeyData<D>[]
    ) => Record<KeyData<D>, string | undefined>;
    setFieldValue: (
        field: KeyData<D>,
        value: GetValue<D, typeof field & string>
    ) => void;
    setFieldError: (field: KeyData<D>, error: string) => void;
    validateField: (field: KeyData<D>) => void;
    isValidField: (field: KeyData<D>) => boolean;
    getFieldValue: (field: KeyData<D>) => GetValue<D, typeof field & string>;
    clearFieldError: (field: KeyData<D>) => void;
    submit: () => void;
};

export type Field<T> = {
    name: string;
    getValue: () => T;
    setValue: (value: T) => void;
    getError: () => string | undefined;
    setError: (error: string | undefined) => void;
    isValid: () => boolean;
    validate: () => void;
    reset: () => void;
};

export type FieldRule<T> = (value: T | unknown) => string | undefined;
export type FieldMask<T> = (value: T | unknown) => T;
