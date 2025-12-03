import { ThemedText } from "@/presentation/theme/components/ThemedText";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { TextInput, useTheme } from "react-native-paper";

interface DateTimeInputProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  icon?: string;
  mode?: "date" | "time" | "datetime";
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

export const DateTimeInput = ({
  control,
  name,
  label,
  placeholder,
  icon = "calendar",
  mode = "datetime",
  error,
  minimumDate,
  maximumDate,
}: DateTimeInputProps) => {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (mode === "date") {
      return `${day}/${month}/${year}`;
    } else if (mode === "time") {
      return `${hours}:${minutes}`;
    } else {
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const handlePickerChange = (event: any, selectedDate?: Date) => {
          if (event.type === "dismissed") {
            setShow(false);
            setPickerMode("date");
            setTempDate(null);
            return;
          }

          if (event.type === "set" && selectedDate) {
            if (mode === "datetime") {
              if (pickerMode === "date") {
                // Guardar fecha temporalmente y mostrar selector de hora
                setTempDate(selectedDate);
                setPickerMode("time");

                if (Platform.OS === "android") {
                  // En Android, cerrar y reabrir con el modo time
                  setShow(false);
                  setTimeout(() => setShow(true), 100);
                }
              } else if (pickerMode === "time") {
                // Combinar fecha temporal con la hora seleccionada
                const finalDate = tempDate || value || new Date();
                finalDate.setHours(selectedDate.getHours());
                finalDate.setMinutes(selectedDate.getMinutes());

                onChange(finalDate);
                setShow(false);
                setPickerMode("date");
                setTempDate(null);
              }
            } else {
              // Para mode="date" o mode="time"
              onChange(selectedDate);
              setShow(false);
            }
          }
        };

        return (
          <View style={styles.container}>
            <Pressable
              onPress={() => {
                setShow(true);
                setPickerMode("date");
                setTempDate(null);
              }}
            >
              <TextInput
                label={label}
                mode="outlined"
                value={formatDate(value)}
                placeholder={placeholder}
                editable={false}
                pointerEvents="none"
                left={<TextInput.Icon icon={icon} />}
                right={
                  <TextInput.Icon
                    icon="chevron-down"
                    onPress={() => {
                      setShow(true);
                      setPickerMode("date");
                      setTempDate(null);
                    }}
                  />
                }
                error={!!error}
                style={styles.input}
                // Estilos explícitos para asegurar legibilidad en light/dark
                contentStyle={{ color: theme.colors.onSurface }}
                outlineColor={theme.colors.onSurfaceVariant}
                activeOutlineColor={theme.colors.primary}
                selectionColor={theme.colors.primary}
                theme={{
                  colors: {
                    text: theme.colors.onSurface,
                    placeholder: theme.colors.onSurfaceVariant,
                  },
                }}
              />
            </Pressable>

            {error && (
              <ThemedText
                style={[styles.errorText, { color: theme.colors.error }]}
              >
                {error}
              </ThemedText>
            )}

            {show && (
              <DateTimePicker
                value={
                  pickerMode === "time"
                    ? tempDate || value || new Date()
                    : value || new Date()
                }
                textColor={theme.colors.onSurface}
                mode={pickerMode}
                is24Hour={true}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={pickerMode === "date" ? minimumDate : undefined}
                maximumDate={pickerMode === "date" ? maximumDate : undefined}
                onChange={handlePickerChange}
              />
            )}
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: "transparent",
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
});
