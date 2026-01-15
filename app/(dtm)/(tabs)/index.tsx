import { getColecciones } from "@/core/avales/actions/colecciones-actions";
import { ColeccionAval } from "@/core/avales/interfaces/coleccion";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { FlatList, RefreshControl, View } from "react-native";
import {
  ActivityIndicator,
  Chip,
  Icon,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

export default function DtmDashboard() {
  const theme = useTheme();
  const router = useRouter();
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["colecciones"],
    queryFn: () => getColecciones(),
  });

  const handlePressItem = (item: ColeccionAval) => {
    router.push({
      pathname: "/(dtm)/coleccion",
      params: { data: JSON.stringify(item) },
    });
  };

  const renderItem = ({ item }: { item: ColeccionAval }) => (
    <Surface
      style={{
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: theme.colors.surface,
        overflow: "hidden",
      }}
      elevation={1}
    >
      <TouchableRipple onPress={() => handlePressItem(item)}>
        <View style={{ padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 12,
            }}
          >
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                {item.evento.nombre}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {item.evento.ciudad}, {item.evento.provincia}
              </Text>
            </View>
            <Chip
              mode="flat"
              style={{
                backgroundColor:
                  item.evento.estado === "ACEPTADO"
                    ? theme.colors.primaryContainer
                    : item.evento.estado === "RECHAZADO"
                    ? theme.colors.errorContainer
                    : theme.colors.secondaryContainer,
              }}
              textStyle={{
                color:
                  item.evento.estado === "ACEPTADO"
                    ? theme.colors.onPrimaryContainer
                    : item.evento.estado === "RECHAZADO"
                    ? theme.colors.onErrorContainer
                    : theme.colors.onSecondaryContainer,
                fontSize: 12,
              }}
            >
              {item.evento.estado || "SOLICITADO"}
            </Chip>
          </View>

          <Text
            variant="bodyMedium"
            numberOfLines={2}
            style={{ marginBottom: 12, color: theme.colors.onSurface }}
          >
            {item.descripcion}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Icon
                source="calendar-outline"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {new Date(item.evento.fechaInicio).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Icon
                source="people-outline"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {item.avalTecnico.atletas + item.avalTecnico.entrenadores} part.
              </Text>
            </View>
          </View>
        </View>
      </TouchableRipple>
    </Surface>
  );

  if (isLoading) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Cargando solicitudes...</Text>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Icon source="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text
          variant="titleMedium"
          style={{
            color: theme.colors.error,
            textAlign: "center",
            marginVertical: 16,
          }}
        >
          Error al cargar las solicitudes
        </Text>
        <Text variant="bodyMedium" style={{ textAlign: "center", marginBottom: 24 }}>
          No pudimos conectar con el servidor. Por favor, intenta de nuevo.
        </Text>
        <Chip onPress={() => refetch()} icon="refresh">
          Reintentar
        </Chip>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>
          Solicitudes de Aval
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Revisa y gestiona las solicitudes pendientes
        </Text>
      </View>

      <FlatList
        data={data?.data || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={{ padding: 32, alignItems: "center" }}>
            <Icon
              source="file-document-outline"
              size={48}
              color={theme.colors.outline}
            />
            <Text
              variant="bodyLarge"
              style={{ color: theme.colors.outline, marginTop: 16 }}
            >
              No hay solicitudes pendientes
            </Text>
          </View>
        }
      />
    </ThemedView>
  );
}
