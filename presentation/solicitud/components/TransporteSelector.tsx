import { ThemedSelect } from "@/presentation/theme/components/ThemedSelect";
import React from "react";
import { Controller } from "react-hook-form";

interface TransporteSelectorProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  icon?: string;
  error?: string;
}

const TRANSPORTE_OPTIONS = [
  { value: "aereo", label: "Aéreo", icon: "airplane" },
  { value: "terrestre", label: "Terrestre", icon: "bus" },
  { value: "vehiculo_propio", label: "Vehículo Propio", icon: "car" },
  { value: "maritimo", label: "Marítimo", icon: "boat" },
  { value: "otro", label: "Otro", icon: "ellipsis-horizontal" },
];

export const TransporteSelector = ({
  control,
  name,
  label,
  placeholder = "Seleccione medio de transporte",
  error,
}: TransporteSelectorProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <ThemedSelect
          label={label}
          placeholder={placeholder}
          value={value}
          onValueChange={onChange}
          options={TRANSPORTE_OPTIONS}
          errorMessage={error}
        />
      )}
    />
  );
};
