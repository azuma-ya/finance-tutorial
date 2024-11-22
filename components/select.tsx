"use client";

import { useMemo } from "react";
import type { SingleValue } from "react-select";
import CreateableSelect from "react-select/creatable";

interface Props {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
}

const Select = ({
  value,
  onChange,
  onCreate,
  disabled,
  options = [],
  placeholder,
}: Props) => {
  const handleSelect = (
    option: SingleValue<{ label: string; value: string }>,
  ) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <CreateableSelect
      placeholder={placeholder}
      className="h-10 text-sm"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#e2e8f0",
          ":hover": {
            borderColor: "#e2e8f0",
          },
        }),
      }}
      value={formattedValue}
      onChange={handleSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  );
};

export default Select;
