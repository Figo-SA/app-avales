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
  { value: "bus_interprovincial", label: "Bus Interprovincial", icon: "bus" },
  { value: "bus_urbano", label: "Bus Urbano", icon: "bus" },
  { value: "avion", label: "Avión", icon: "airplane" },
  { value: "vehiculo_propio", label: "Vehículo Propio", icon: "car" },
  { value: "taxi", label: "Taxi", icon: "taxi" },
  { value: "tren", label: "Tren", icon: "train" },
  { value: "otro", label: "Otro", icon: "dots-horizontal" },
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
