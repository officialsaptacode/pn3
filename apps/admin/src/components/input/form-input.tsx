import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label?: string;
  type?: React.ComponentProps<typeof Input>["type"];
  required?: boolean;
  optional?: boolean;
}

const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label = "Label",
  type = "text",
  required,
  optional,
  ...props
}: FormInputProps<TFieldValues, TName>) => {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          <FormLabel required={required} optional={optional}>
            {label}
          </FormLabel>
          <FormControl className="group">
            <Input
              className="border-none shadow-none"
              type={type}
              {...field}
              inputMode={type === "number" ? "numeric" : "text"}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
interface PasswordInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<FormInputProps<TFieldValues, TName>, "type"> {}

const PasswordInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label = "Password",
  required,
  optional,
  ...props
}: PasswordInputProps<TFieldValues, TName>) => {
  const [show, setShow] = useState(false);

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          <FormLabel required={required} optional={optional}>
            {label}
          </FormLabel>
          <FormControl>
            <div className="flex rounded-md border items-center">
              <Input
                className="border-none shadow-none flex-1"
                type={show ? "text" : "password"}
                {...field}
              />
              <button
                type="button"
                tabIndex={-1}
                className="px-2 focus:outline-none"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? (
                  // Eye-off SVG
                  <EyeOffIcon />
                ) : (
                  // Eye SVG
                  <EyeIcon />
                )}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { FormInput, PasswordInput };
