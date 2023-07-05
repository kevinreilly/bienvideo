/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Track } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type TrackUpdateFormInputValues = {
    videoID?: string;
    cues?: string[];
};
export declare type TrackUpdateFormValidationValues = {
    videoID?: ValidationFunction<string>;
    cues?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TrackUpdateFormOverridesProps = {
    TrackUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    videoID?: PrimitiveOverrideProps<TextFieldProps>;
    cues?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type TrackUpdateFormProps = React.PropsWithChildren<{
    overrides?: TrackUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    track?: Track;
    onSubmit?: (fields: TrackUpdateFormInputValues) => TrackUpdateFormInputValues;
    onSuccess?: (fields: TrackUpdateFormInputValues) => void;
    onError?: (fields: TrackUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TrackUpdateFormInputValues) => TrackUpdateFormInputValues;
    onValidate?: TrackUpdateFormValidationValues;
} & React.CSSProperties>;
export default function TrackUpdateForm(props: TrackUpdateFormProps): React.ReactElement;
