import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { Dimensions, ScrollView, View } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import { Chip, Surface, Text, useTheme } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;

export default function AdminDashboard() {
  const theme = useTheme();

  // --- Dummy Data ---

  // 1. Avales Completados vs En Proceso (Pie Chart)
  const avalesStatusData = [
    { value: 65, color: theme.colors.primary, text: "65%" },
    { value: 35, color: theme.colors.secondary, text: "35%" },
  ];

  // 2. Avales por Categoría (Bar Chart)
  const avalesByCategoryData = [
    { value: 12, label: "U12", frontColor: theme.colors.primary },
    { value: 25, label: "U14", frontColor: theme.colors.secondary },
    { value: 18, label: "U16", frontColor: theme.colors.tertiary },
    { value: 30, label: "U18", frontColor: theme.colors.error },
    { value: 10, label: "Mayores", frontColor: theme.colors.primaryContainer },
  ];

  // 3. Presupuesto (Line Chart)
  const budgetData = [
    { value: 5000, label: "Ene" },
    { value: 12000, label: "Feb" },
    { value: 9000, label: "Mar" },
    { value: 15000, label: "Abr" },
    { value: 22000, label: "May" },
    { value: 18000, label: "Jun" },
  ];

  const SectionTitle = ({ title }: { title: string }) => (
    <Text
      variant="titleLarge"
      style={{
        fontWeight: "bold",
        marginBottom: 16,
        marginTop: 24,
        paddingHorizontal: 16,
        color: theme.colors.onSurface,
      }}
    >
      {title}
    </Text>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ padding: 16, paddingBottom: 8 }}>
          <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>
            Panel de Control
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Resumen estadístico de avales y presupuesto
          </Text>
        </View>

        {/* 1. Estado de Avales */}
        <SectionTitle title="Estado de Avales" />
        <Surface
          style={{
            marginHorizontal: 16,
            padding: 20,
            borderRadius: 16,
            backgroundColor: theme.colors.surface,
            alignItems: "center",
          }}
          elevation={2}
        >
          <PieChart
            data={avalesStatusData}
            donut
            showText
            textColor={theme.colors.onPrimary}
            radius={100}
            innerRadius={60}
            textSize={16}
            focusOnPress
            centerLabelComponent={() => (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                  variant="headlineMedium"
                  style={{ fontWeight: "bold", color: theme.colors.primary }}
                >
                  100
                </Text>
                <Text variant="bodySmall">Total</Text>
              </View>
            )}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
              gap: 16,
              width: "100%",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: theme.colors.primary,
                }}
              />
              <Text>Completados</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: theme.colors.secondary,
                }}
              />
              <Text>En Proceso</Text>
            </View>
          </View>
        </Surface>

        {/* 2. Avales por Categoría */}
        <SectionTitle title="Avales por Categoría" />
        <Surface
          style={{
            marginHorizontal: 16,
            padding: 20,
            borderRadius: 16,
            backgroundColor: theme.colors.surface,
          }}
          elevation={2}
        >
          <BarChart
            data={avalesByCategoryData}
            barWidth={30}
            noOfSections={4}
            barBorderRadius={4}
            frontColor={theme.colors.primary}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            isAnimated
            animationDuration={1000}
            width={screenWidth - 80} // Adjust width based on padding
          />
        </Surface>

        {/* 3. Presupuesto Ejecutado */}
        <SectionTitle title="Presupuesto Ejecutado ($)" />
        <Surface
          style={{
            marginHorizontal: 16,
            padding: 20,
            borderRadius: 16,
            backgroundColor: theme.colors.surface,
          }}
          elevation={2}
        >
          <LineChart
            data={budgetData}
            color={theme.colors.primary}
            thickness={3}
            dataPointsColor={theme.colors.secondary}
            startFillColor={theme.colors.primaryContainer}
            endFillColor={theme.colors.primaryContainer}
            startOpacity={0.9}
            endOpacity={0.2}
            initialSpacing={10}
            noOfSections={5}
            yAxisThickness={0}
            rulesType="solid"
            rulesColor={theme.colors.outlineVariant}
            yAxisTextStyle={{ color: theme.colors.onSurfaceVariant }}
            width={screenWidth - 80}
            curved
            isAnimated
            areaChart
          />
          <View style={{ marginTop: 16, alignItems: "center" }}>
            <Chip icon="cash" style={{ backgroundColor: theme.colors.secondaryContainer }}>
              Total Ejecutado: $81,000
            </Chip>
          </View>
        </Surface>
      </ScrollView>
    </ThemedView>
  );
}
