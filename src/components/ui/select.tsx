"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

type SelectContextValue = {
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  value: string;
};

type SelectProps = {
  children?: React.ReactNode;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  value?: string;
};

type SelectTriggerProps = Omit<
  React.ComponentPropsWithoutRef<"select">,
  "children" | "defaultValue" | "onChange" | "value"
> & {
  children?: React.ReactNode;
};

type SelectValueProps = {
  children?: React.ReactNode;
  placeholder?: React.ReactNode;
};

type SelectContentProps = {
  children?: React.ReactNode;
};

type SelectItemProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  value: string;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

function textFromNode(node: React.ReactNode): string {
  return React.Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (React.isValidElement<{ children?: React.ReactNode }>(child)) {
        return textFromNode(child.props.children);
      }
      return "";
    })
    .join("")
    .trim();
}

function isSelectItem(child: React.ReactNode): child is React.ReactElement<SelectItemProps> {
  return React.isValidElement(child) && Boolean((child.type as { __selectItem?: boolean }).__selectItem);
}

function isSelectValue(child: React.ReactNode): child is React.ReactElement<SelectValueProps> {
  return React.isValidElement(child) && Boolean((child.type as { __selectValue?: boolean }).__selectValue);
}

function collectOptions(children: React.ReactNode): SelectOption[] {
  const options: SelectOption[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return;
    if (isSelectItem(child)) {
      options.push({
        disabled: child.props.disabled,
        label: textFromNode(child.props.children) || child.props.value,
        value: child.props.value,
      });
      return;
    }
    options.push(...collectOptions(child.props.children));
  });

  return options;
}

function findPlaceholder(children: React.ReactNode): React.ReactNode {
  let placeholder: React.ReactNode;

  React.Children.forEach(children, (child) => {
    if (placeholder !== undefined) return;
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return;
    if (isSelectValue(child)) {
      placeholder = child.props.placeholder;
      return;
    }
    placeholder = findPlaceholder(child.props.children);
  });

  return placeholder;
}

function Select({ children, defaultValue = "", disabled, onValueChange, value }: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value ?? internalValue;
  const options = React.useMemo(() => collectOptions(children), [children]);
  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      disabled,
      onValueChange: (nextValue) => {
        if (value === undefined) setInternalValue(nextValue);
        onValueChange?.(nextValue);
      },
      options,
      value: currentValue,
    }),
    [currentValue, disabled, onValueChange, options, value],
  );

  return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>;
}

const SelectGroup = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

function SelectValue(_props: SelectValueProps) {
  return null;
}
SelectValue.__selectValue = true;

const SelectTrigger = React.forwardRef<HTMLSelectElement, SelectTriggerProps>(
  ({ className, children, disabled, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) {
      throw new Error("SelectTrigger must be used within Select");
    }
    const placeholder = findPlaceholder(children);
    const leading = React.Children.toArray(children).filter((child) => !isSelectValue(child));

    return (
      <span className="relative inline-block align-middle">
        {leading.length > 0 && (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 flex -translate-y-1/2 items-center text-muted-foreground">
            {leading}
          </span>
        )}
        <select
          ref={ref}
          className={cn(
            "flex h-9 w-full appearance-none items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 pr-8 text-sm shadow-sm data-[placeholder]:text-muted-foreground focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            leading.length > 0 && "pl-9",
            className,
          )}
          disabled={disabled ?? context.disabled}
          value={context.value}
          onChange={(event) => context.onValueChange?.(event.target.value)}
          {...props}
        >
          {placeholder !== undefined && !context.value && (
            <option value="" disabled>
              {textFromNode(placeholder)}
            </option>
          )}
          {context.options.map((option) => (
            <option key={option.value} disabled={option.disabled} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
      </span>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

function SelectContent(_props: SelectContentProps) {
  return null;
}

function SelectLabel({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function SelectItem(_props: SelectItemProps) {
  return null;
}
SelectItem.__selectItem = true;

function SelectSeparator() {
  return null;
}

function SelectScrollUpButton() {
  return null;
}

function SelectScrollDownButton() {
  return null;
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
