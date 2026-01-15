import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import { Surface, Text, useTheme } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;

export default function AdminDashboard() {
  const theme = useTheme();

  // --- Datos de ejemplo ---

  // KPIs
  const kpiData = [
    {
      title: "Total Avales",
      value: "156",
      change: "+12%",
      isPositive: true,
      icon: "document-text",
      color: theme.colors.primary,
    },
    {
      title: "Completados",
      value: "98",
      change: "+8%",
      isPositive: true,
      icon: "checkmark-circle",
      color: "#10B981",
    },
    {
      title: "En Proceso",
      value: "45",
      change: "-3%",
      isPositive: false,
      icon: "time",
      color: "#F59E0B",
    },
    {
      title: "Rechazados",
      value: "13",
      change: "-15%",
      isPositive: true,
      icon: "close-circle",
      color: "#EF4444",
    },
  ];

  // 1. Estado de Avales (Pie Chart)
  const avalesStatusData = [
    { value: 63, color: "#10B981", text: "63%", label: "Completados" },
    { value: 29, color: "#F59E0B", text: "29%", label: "En Proceso" },
    { value: 8, color: "#EF4444", text: "8%", label: "Rechazados" },
  ];

  // 2. Avales por Categoría (Bar Chart)
  const avalesByCategoryData = [
    { value: 12, label: "U12", frontColor: "#6366F1", topLabelComponent: () => <Text style={styles.barLabel}>12</Text> },
    { value: 25, label: "U14", frontColor: "#8B5CF6", topLabelComponent: () => <Text style={styles.barLabel}>25</Text> },
    { value: 18, label: "U16", frontColor: "#A855F7", topLabelComponent: () => <Text style={styles.barLabel}>18</Text> },
    { value: 30, label: "U18", frontColor: "#D946EF", topLabelComponent: () => <Text style={styles.barLabel}>30</Text> },
    { value: 15, label: "Senior", frontColor: "#EC4899", topLabelComponent: () => <Text style={styles.barLabel}>15</Text> },
  ];

  // 3. Tendencia Mensual (Line Chart)
  const trendData = [
    { value: 15, label: "Ene", dataPointText: "15" },
    { value: 22, label: "Feb", dataPointText: "22" },
    { value: 18, label: "Mar", dataPointText: "18" },
    { value: 28, label: "Abr", dataPointText: "28" },
    { value: 35, label: "May", dataPointText: "35" },
    { value: 42, label: "Jun", dataPointText: "42" },
  ];

  const KPICard = ({ item }: { item: typeof kpiData[0] }) => (
    <Surface style={[styles.kpiCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
      <View style={[styles.kpiIconContainer, { backgroundColor: `${item.color}15` }]}>
        <Ionicons name={item.icon as any} size={22} color={item.color} />
      </View>
      <Text style={[styles.kpiValue, { color: theme.colors.onSurface }]}>{item.value}</Text>
      <Text style={[styles.kpiTitle, { color: theme.colors.onSurfaceVariant }]}>{item.title}</Text>
      <View style={styles.kpiChangeContainer}>
        <Ionicons
          name={item.isPositive ? "trending-up" : "trending-down"}
          size={14}
          color={item.isPositive ? "#10B981" : "#EF4444"}
        />
        <Text style={[styles.kpiChange, { color: item.isPositive ? "#10B981" : "#EF4444" }]}>
          {item.change}
        </Text>
      </View>
    </Surface>
  );

  const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>{subtitle}</Text>
      )}
    </View>
  );

  const LegendItem = ({ color, label, value }: { color: string; label: string; value?: string }) => (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendText, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
      {value && <Text style={[styles.legendValue, { color: theme.colors.onSurface }]}>{value}</Text>}
    </View>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Panel de Control</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Resumen de actividad y estadísticas
          </Text>
        </View>

        {/* KPIs */}
        <View style={styles.kpiGrid}>
          {kpiData.map((item, index) => (
            <KPICard key={index} item={item} />
          ))}
        </View>

        {/* Estado de Avales - Pie Chart */}
        <SectionHeader title="Distribución de Estados" subtitle="Estado actual de todos los avales" />
        <Surface style={[styles.chartCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={avalesStatusData}
              donut
              showText
              textColor="#FFFFFF"
              textSize={12}
              fontWeight="bold"
              radius={85}
              innerRadius={55}
              focusOnPress
              toggleFocusOnPress
              innerCircleColor={theme.colors.surface}
              centerLabelComponent={() => (
                <View style={styles.pieCenter}>
                  <Text style={[styles.pieCenterValue, { color: theme.colors.primary }]}>156</Text>
                  <Text style={[styles.pieCenterLabel, { color: theme.colors.onSurfaceVariant }]}>Total</Text>
                </View>
              )}
            />
            <View style={styles.pieLegend}>
              {avalesStatusData.map((item, index) => (
                <LegendItem key={index} color={item.color} label={item.label} value={item.text} />
              ))}
            </View>
          </View>
        </Surface>

        {/* Avales por Categoría - Bar Chart */}
        <SectionHeader title="Avales por Categoría" subtitle="Distribución según grupo de edad" />
        <Surface style={[styles.chartCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
          <BarChart
            data={avalesByCategoryData}
            barWidth={40}
            spacing={24}
            noOfSections={4}
            barBorderRadius={8}
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor={theme.colors.outlineVariant}
            xAxisLabelTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}
            yAxisTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 11 }}
            hideRules
            isAnimated
            animationDuration={800}
            width={screenWidth - 100}
            maxValue={35}
            showGradient
            gradientColor="#6366F120"
          />
        </Surface>

        {/* Tendencia Mensual - Line Chart */}
        <SectionHeader title="Tendencia de Solicitudes" subtitle="Evolución mensual de nuevas solicitudes" />
        <Surface style={[styles.chartCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
          <LineChart
            data={trendData}
            color={theme.colors.primary}
            thickness={3}
            dataPointsColor={theme.colors.primary}
            dataPointsRadius={5}
            startFillColor={`${theme.colors.primary}40`}
            endFillColor={`${theme.colors.primary}05`}
            startOpacity={0.8}
            endOpacity={0.1}
            initialSpacing={20}
            endSpacing={20}
            spacing={50}
            noOfSections={5}
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor={theme.colors.outlineVariant}
            rulesType="dashed"
            rulesColor={theme.colors.outlineVariant}
            dashWidth={4}
            dashGap={4}
            yAxisTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 11 }}
            xAxisLabelTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}
            width={screenWidth - 100}
            curved
            isAnimated
            animationDuration={1000}
            areaChart
            hideDataPoints={false}
            showVerticalLines
            verticalLinesColor={`${theme.colors.outlineVariant}50`}
            pointerConfig={{
              pointerStripHeight: 140,
              pointerStripColor: theme.colors.primary,
              pointerStripWidth: 2,
              pointerColor: theme.colors.primary,
              radius: 6,
              pointerLabelWidth: 100,
              pointerLabelHeight: 90,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: true,
              pointerLabelComponent: (items: any) => (
                <View style={[styles.tooltipContainer, { backgroundColor: theme.colors.inverseSurface }]}>
                  <Text style={[styles.tooltipValue, { color: theme.colors.inverseOnSurface }]}>
                    {items[0].value} solicitudes
                  </Text>
                </View>
              ),
            }}
          />
          <View style={styles.chartFooter}>
            <View style={styles.chartStat}>
              <Text style={[styles.chartStatLabel, { color: theme.colors.onSurfaceVariant }]}>
                Promedio mensual
              </Text>
              <Text style={[styles.chartStatValue, { color: theme.colors.primary }]}>26.7</Text>
            </View>
            <View style={styles.chartStatDivider} />
            <View style={styles.chartStat}>
              <Text style={[styles.chartStatLabel, { color: theme.colors.onSurfaceVariant }]}>
                Crecimiento
              </Text>
              <Text style={[styles.chartStatValue, { color: "#10B981" }]}>+180%</Text>
            </View>
          </View>
        </Surface>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 12,
  },
  kpiCard: {
    width: (screenWidth - 48) / 2,
    padding: 16,
    borderRadius: 16,
  },
  kpiIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  kpiTitle: {
    fontSize: 13,
    marginTop: 2,
  },
  kpiChangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  kpiChange: {
    fontSize: 12,
    fontWeight: "600",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  chartCard: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
  },
  pieChartContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pieCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  pieCenterValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  pieCenterLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  pieLegend: {
    flex: 1,
    marginLeft: 24,
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendText: {
    fontSize: 13,
    flex: 1,
  },
  legendValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  barLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6366F1",
    marginBottom: 4,
  },
  chartFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  chartStat: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  chartStatLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  chartStatValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  chartStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
  },
  tooltipContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tooltipValue: {
    fontSize: 12,
    fontWeight: "600",
  },
});
