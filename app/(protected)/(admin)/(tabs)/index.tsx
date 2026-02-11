import { getAllStatistics } from "@/core/statistics/actions/statistics-actions";
import { AllStatistics } from "@/core/statistics/interfaces/statistics.interface";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Dimensions, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import { ActivityIndicator, Surface, Text, useTheme } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;

import { ESTADO_COLORS } from "@/core/constants/avales.constants";

const CATEGORY_COLORS = ["#6366F1", "#8B5CF6", "#A855F7", "#D946EF", "#EC4899", "#F43F5E"];

export default function AdminDashboard() {
  const theme = useTheme();

  // Fetch all statistics
  const {
    data: stats,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<AllStatistics>({
    queryKey: ["statistics"],
    queryFn: () => getAllStatistics(),
  });

  // Build KPI data from API response
  const kpiData = stats
    ? [
        {
          title: "Total Avales",
          value: stats.dashboard.totalAvales.toString(),
          icon: "document-text",
          color: theme.colors.primary,
        },
        {
          title: "Aprobados",
          value: stats.dashboard.avalesAprobados.toString(),
          icon: "checkmark-circle",
          color: "#10B981",
        },
        {
          title: "Pendientes",
          value: stats.dashboard.avalesPendientes.toString(),
          icon: "time",
          color: "#F59E0B",
        },
        {
          title: "Rechazados",
          value: stats.dashboard.avalesRechazados.toString(),
          icon: "close-circle",
          color: "#EF4444",
        },
      ]
    : [];

  // Build pie chart data from API response
  const pieChartData = stats
    ? stats.porEstado.items.map((item) => {
        const percentage = stats.porEstado.total > 0
          ? Math.round((item.value / stats.porEstado.total) * 100)
          : 0;
        return {
          value: item.value,
          color: item.color || ESTADO_COLORS[item.label] || "#757575",
          text: `${percentage}%`,
          label: item.label,
        };
      })
    : [];

  // Build bar chart data from API response (by category)
  const barChartData = stats
    ? stats.porCategoria.items.slice(0, 6).map((item, index) => ({
        value: item.value,
        label: item.label.length > 8 ? item.label.substring(0, 8) + "..." : item.label,
        frontColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        topLabelComponent: () => (
          <Text style={[styles.barLabel, { color: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }]}>
            {item.value}
          </Text>
        ),
      }))
    : [];

  // Build line chart data from API response (timeline)
  const lineChartData = stats
    ? stats.timeline.items.map((item) => ({
        value: item.creados,
        label: item.label.substring(0, 3), // Short month name
        dataPointText: item.creados.toString(),
      }))
    : [];

  // Calculate average and growth for the chart footer
  const avgMonthly = stats && stats.timeline.items.length > 0
    ? (stats.timeline.items.reduce((sum, item) => sum + item.creados, 0) / stats.timeline.items.length).toFixed(1)
    : "0";

  const growth = stats && stats.timeline.items.length >= 2
    ? (() => {
        const first = stats.timeline.items[0].creados || 1;
        const last = stats.timeline.items[stats.timeline.items.length - 1].creados;
        return Math.round(((last - first) / first) * 100);
      })()
    : 0;

  const KPICard = ({ item }: { item: (typeof kpiData)[0] }) => (
    <Surface style={[styles.kpiCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
      <View style={[styles.kpiIconContainer, { backgroundColor: `${item.color}15` }]}>
        <Ionicons name={item.icon as any} size={22} color={item.color} />
      </View>
      <Text style={[styles.kpiValue, { color: theme.colors.onSurface }]}>{item.value}</Text>
      <Text style={[styles.kpiTitle, { color: theme.colors.onSurfaceVariant }]}>{item.title}</Text>
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

  if (isLoading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}>
          Cargando estadísticas...
        </Text>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.error, textAlign: "center", marginVertical: 16 }}
        >
          Error al cargar las estadísticas
        </Text>
        <Text variant="bodyMedium" style={{ textAlign: "center", color: theme.colors.onSurfaceVariant }}>
          No pudimos conectar con el servidor. Por favor, intenta de nuevo.
        </Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
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

        {/* Additional Stats */}
        {stats && (
          <View style={styles.extraStats}>
            <Surface style={[styles.extraStatCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <Ionicons name="calendar" size={20} color={theme.colors.primary} />
              <Text style={[styles.extraStatValue, { color: theme.colors.onSurface }]}>
                {stats.dashboard.totalEventos}
              </Text>
              <Text style={[styles.extraStatLabel, { color: theme.colors.onSurfaceVariant }]}>Eventos</Text>
            </Surface>
            <Surface style={[styles.extraStatCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <Ionicons name="people" size={20} color={theme.colors.primary} />
              <Text style={[styles.extraStatValue, { color: theme.colors.onSurface }]}>
                {stats.dashboard.totalDeportistas}
              </Text>
              <Text style={[styles.extraStatLabel, { color: theme.colors.onSurfaceVariant }]}>Deportistas</Text>
            </Surface>
            <Surface style={[styles.extraStatCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <Ionicons name="fitness" size={20} color={theme.colors.primary} />
              <Text style={[styles.extraStatValue, { color: theme.colors.onSurface }]}>
                {stats.dashboard.totalEntrenadores}
              </Text>
              <Text style={[styles.extraStatLabel, { color: theme.colors.onSurfaceVariant }]}>Entrenadores</Text>
            </Surface>
          </View>
        )}

        {/* Estado de Avales - Pie Chart */}
        {pieChartData.length > 0 && (
          <>
            <SectionHeader title="Distribución de Estados" subtitle="Estado actual de todos los avales" />
            <Surface style={[styles.chartCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
              <View style={styles.pieChartContainer}>
                <PieChart
                  data={pieChartData}
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
                      <Text style={[styles.pieCenterValue, { color: theme.colors.primary }]}>
                        {stats?.porEstado.total || 0}
                      </Text>
                      <Text style={[styles.pieCenterLabel, { color: theme.colors.onSurfaceVariant }]}>
                        Total
                      </Text>
                    </View>
                  )}
                />
                <View style={styles.pieLegend}>
                  {pieChartData.map((item, index) => (
                    <LegendItem key={index} color={item.color} label={item.label} value={item.text} />
                  ))}
                </View>
              </View>
            </Surface>
          </>
        )}

        {/* Avales por Categoría - Bar Chart */}
        {barChartData.length > 0 && (
          <>
            <SectionHeader title="Avales por Categoría" subtitle="Distribución según categoría" />
            <Surface style={[styles.chartCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
              <BarChart
                data={barChartData}
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
                showGradient
                gradientColor="#6366F120"
              />
            </Surface>
          </>
        )}

        {/* Tendencia Mensual - Line Chart */}
        {lineChartData.length > 0 && (
          <>
            <SectionHeader title="Tendencia de Solicitudes" subtitle="Evolución mensual de nuevas solicitudes" />
            <Surface style={[styles.chartCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
              <LineChart
                data={lineChartData}
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
                  <Text style={[styles.chartStatValue, { color: theme.colors.primary }]}>{avgMonthly}</Text>
                </View>
                <View style={styles.chartStatDivider} />
                <View style={styles.chartStat}>
                  <Text style={[styles.chartStatLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Crecimiento
                  </Text>
                  <Text
                    style={[styles.chartStatValue, { color: growth >= 0 ? "#10B981" : "#EF4444" }]}
                  >
                    {growth >= 0 ? "+" : ""}{growth}%
                  </Text>
                </View>
              </View>
            </Surface>
          </>
        )}
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
  extraStats: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 16,
  },
  extraStatCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  extraStatValue: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
  },
  extraStatLabel: {
    fontSize: 11,
    marginTop: 2,
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
