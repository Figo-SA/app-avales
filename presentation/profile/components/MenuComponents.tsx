import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Surface, Text, useTheme } from "react-native-paper";

interface MenuOptionProps {
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
  rightElement?: React.ReactNode;
}

export const MenuOption = ({
  title,
  subtitle,
  icon,
  onPress,
  rightElement,
}: MenuOptionProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={styles.menuOption}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuOptionLeft}>
        <View style={styles.menuIconContainer}>
          <Icon source={icon} size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.menuTextContainer}>
          <Text variant="bodyLarge" style={styles.menuTitle}>
            {title}
          </Text>
          {subtitle && (
            <Text variant="bodySmall" style={styles.menuSubtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement || (
        <Icon
          source="ion:chevron-forward"
          size={20}
          color={theme.colors.onSurfaceVariant}
        />
      )}
    </TouchableOpacity>
  );
};

interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
}

export const MenuSection = ({ title, children }: MenuSectionProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        {title}
      </Text>
      <Surface style={styles.menuContainer} elevation={1}>
        <View style={styles.menuContent}>{children}</View>
      </Surface>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    section: {
      marginHorizontal: 16,
      marginBottom: 24,
    },
    sectionTitle: {
      fontWeight: "bold",
      marginBottom: 12,
      color: theme.colors.onBackground,
    },
    menuContainer: {
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
    },
    menuContent: {
      borderRadius: 16,
    },
    menuOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 18,
      paddingHorizontal: 20,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.outline + "20",
    },
    menuOptionLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    menuIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
      backgroundColor: theme.colors.primaryContainer,
    },
    menuTextContainer: {
      flex: 1,
    },
    menuTitle: {
      color: theme.colors.onSurface,
    },
    menuSubtitle: {
      color: theme.colors.onSurfaceVariant,
    },
  });
