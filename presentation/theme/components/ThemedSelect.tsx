import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Icon, Menu, Text, useTheme } from "react-native-paper";

interface Option {
  label: string;
  value: string;
  icon?: string;
}

interface Props {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  errorMessage?: string;
  icon?: string;
  selectedIcon?: string;
  compact?: boolean;
}

export function ThemedSelect({
  label,
  placeholder,
  value,
  onValueChange,
  options,
  errorMessage,
  icon = "chevron-down",
  selectedIcon,
  compact = false,
}: Props) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelection = (optionValue: string) => {
    onValueChange(optionValue);
    closeMenu();
  };

  const getLeftIcon = () => {
    if (selectedOption) {
      return selectedOption.icon || selectedIcon;
    }
    return null;
  };

  const leftIcon = getLeftIcon();

  return (
    <View style={styles.container}>
      <Text
        variant="labelMedium"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        {label}
      </Text>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        contentStyle={{
          backgroundColor: theme.colors.surface,
          minWidth: compact ? 200 : 250,
        }}
        anchor={
          <Button
            mode="outlined"
            onPress={openMenu}
            icon={icon}
            style={[
              styles.button,
              {
                borderColor: errorMessage
                  ? theme.colors.error
                  : theme.colors.outline,
                backgroundColor: theme.colors.surface,
              },
            ]}
            contentStyle={[
              styles.buttonContent,
              { flexDirection: "row-reverse" },
            ]}
            textColor={
              selectedOption
                ? theme.colors.onSurface
                : theme.colors.onSurfaceVariant
            }
          >
            <View style={styles.buttonTextContainer}>
              {leftIcon && (
                <Icon
                  source={leftIcon}
                  size={18}
                  color={theme.colors.onSurface}
                />
              )}
              <Text
                variant={compact ? "bodySmall" : "bodyMedium"}
                style={{
                  color: selectedOption
                    ? theme.colors.onSurface
                    : theme.colors.onSurfaceVariant,
                  marginLeft: leftIcon ? (compact ? 4 : 8) : 0,
                  flex: 1,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {selectedOption ? selectedOption.label : placeholder}
              </Text>
            </View>
          </Button>
        }
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            onPress={() => handleSelection(option.value)}
            title={option.label}
            leadingIcon={option.icon}
            titleStyle={{
              color: theme.colors.onSurface,
              fontSize: compact ? 14 : 16,
            }}
          />
        ))}
      </Menu>
      {errorMessage && (
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.error, marginTop: 4 }}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  button: {
    justifyContent: "flex-start",
    marginTop: 4,
    minHeight: 48,
  },
  buttonContent: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
    height: 48,
  },
  buttonTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    overflow: "hidden",
  },
});
