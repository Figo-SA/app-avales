import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Modal, FlatList } from "react-native";
import { Text, useTheme, Surface, IconButton } from "react-native-paper";

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
}

export function SimpleSelect({
  label,
  placeholder,
  value,
  onValueChange,
  options,
  errorMessage,
}: Props) {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelection = (optionValue: string) => {
    onValueChange(optionValue);
    setModalVisible(false);
  };

  const renderOption = ({ item }: { item: Option }) => (
    <TouchableOpacity
      style={[
        styles.option,
        {
          backgroundColor: item.value === value ? theme.colors.primaryContainer : 'transparent',
          borderBottomColor: theme.colors.outlineVariant,
        }
      ]}
      onPress={() => handleSelection(item.value)}
    >
      <Text
        variant="bodyMedium"
        style={{
          color: item.value === value ? theme.colors.onPrimaryContainer : theme.colors.onSurface,
          fontWeight: item.value === value ? '600' : '400',
        }}
      >
        {item.label}
      </Text>
      {item.value === value && (
        <Text style={{ color: theme.colors.primary, fontSize: 16 }}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text
        variant="labelMedium"
        style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}
      >
        {label}
      </Text>
      
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Surface
          style={[
            styles.button,
            {
              borderColor: errorMessage ? theme.colors.error : theme.colors.outline,
              borderWidth: 1,
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <Text
            variant="bodyMedium"
            style={{
              color: selectedOption ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
              flex: 1,
            }}
            numberOfLines={1}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>▼</Text>
        </Surface>
      </TouchableOpacity>

      {errorMessage && (
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.error, marginTop: 4 }}
        >
          {errorMessage}
        </Text>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Surface
              style={[
                styles.modalContent,
                { backgroundColor: theme.colors.surface }
              ]}
            >
              <View style={styles.modalHeader}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                  {label}
                </Text>
                <IconButton
                  icon="close"
                  size={20}
                  onPress={() => setModalVisible(false)}
                />
              </View>
              
              <FlatList
                data={options}
                renderItem={renderOption}
                keyExtractor={(item) => item.value}
                style={styles.optionsList}
                showsVerticalScrollIndicator={false}
              />
            </Surface>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 4,
    minHeight: 48,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '60%',
  },
  modalContent: {
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
});
