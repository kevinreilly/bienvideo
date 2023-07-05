/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type TrackCreateFormInputValues = {
    videoID?: string;
    cues?: string[];
};
export declare type TrackCreateFormValidationValues = {
    videoID?: ValidationFunction<string>;
    cues?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TrackCreateFormOverridesProps = {
    TrackCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    videoID?: PrimitiveOverrideProps<TextFieldProps>;
    cues?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type TrackCreateFormProps = React.PropsWithChildren<{
    overrides?: TrackCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: TrackCreateFormInputValues) => TrackCreateFormInputValues;
    onSuccess?: (fields: TrackCreateFormInputValues) => void;
    onError?: (fields: TrackCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TrackCreateFormInputValues) => TrackCreateFormInputValues;
    onValidate?: TrackCreateFormValidationValues;
} & React.CSSProperties>;
export default function TrackCreateForm(props: TrackCreateFormProps): React.ReactElement;
