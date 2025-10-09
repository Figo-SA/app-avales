import { getStatusConfig } from "@/core/avales/helpers/statusHelper";
import { Aval } from "@/core/avales/interfaces/aval";
import React from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  Icon,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";

interface AvalDetailProps {
  aval: Aval;
}

const InfoRow = ({ icon, label, value, theme }: any) => (
  <View style={styles.infoRow}>
    <Icon source={icon} size={20} color={theme.colors.primary} />
    <View style={styles.infoContent}>
      <Text
        variant="bodySmall"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        {label}
      </Text>
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurface, fontWeight: "600" }}
      >
        {value}
      </Text>
    </View>
  </View>
);

export const AvalDetail = ({ aval }: AvalDetailProps) => {
  const theme = useTheme();
  const statusConfig = getStatusConfig(aval.status);

  const totalDeportistas = aval.deportistas.length;
  const totalEntrenadores =
    aval.numeroEntrenadoresHombres + aval.numeroEntrenadoresMujeres;

  const handleDownloadDocument = () => {
    if (aval.documentoUrl) {
      Linking.openURL(aval.documentoUrl);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Header Card */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text
                variant="headlineSmall"
                style={[styles.title, { color: theme.colors.onSurface }]}
              >
                {aval.evento}
              </Text>
              <View style={styles.headerBadges}>
                <Surface
                  style={[
                    styles.badge,
                    { backgroundColor: theme.colors.primaryContainer },
                  ]}
                  elevation={0}
                >
                  <Icon
                    source="ion:basketball"
                    size={14}
                    color={theme.colors.onPrimaryContainer}
                  />
                  <Text
                    variant="labelSmall"
                    style={{
                      color: theme.colors.onPrimaryContainer,
                      marginLeft: 4,
                    }}
                  >
                    {aval.deporte}
                  </Text>
                </Surface>
                <Surface
                  style={[
                    styles.badge,
                    { backgroundColor: theme.colors.secondaryContainer },
                  ]}
                  elevation={0}
                >
                  <Text
                    variant="labelSmall"
                    style={{ color: theme.colors.onSecondaryContainer }}
                  >
                    {aval.alcance}
                  </Text>
                </Surface>
              </View>
            </View>
            <Chip
              icon={statusConfig.icon}
              style={[
                styles.statusChip,
                {
                  backgroundColor: `${statusConfig.color}15`,
                  borderColor: statusConfig.color,
                },
              ]}
              textStyle={{ color: statusConfig.color, fontWeight: "600" }}
            >
              {statusConfig.label}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {/* Información del Evento */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.onSurface,
              marginBottom: 16,
              fontWeight: "700",
            }}
          >
            Información del Evento
          </Text>

          <InfoRow
            icon="ion:calendar"
            label="Fechas del evento"
            value={`${new Date(aval.fechaInicio).toLocaleDateString(
              "es-ES"
            )} - ${new Date(aval.fechaFin).toLocaleDateString("es-ES")}`}
            theme={theme}
          />

          <InfoRow
            icon="ion:location"
            label="Provincia"
            value={aval.provincia}
            theme={theme}
          />

          <InfoRow
            icon="ion:flag"
            label="Tipo de Evento"
            value={aval.tipoEvento}
            theme={theme}
          />

          <InfoRow
            icon="ion:ribbon"
            label="Categoría"
            value={aval.categoria}
            theme={theme}
          />

          <InfoRow
            icon="ion:trophy"
            label="Tipo de Participación"
            value={aval.tipoParticipacion}
            theme={theme}
          />
        </Card.Content>
      </Card>

      {/* Deportistas y Entrenadores */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.onSurface,
              marginBottom: 12,
              fontWeight: "700",
            }}
          >
            Participantes
          </Text>

          {/* Estadísticas minimalistas */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon
                source="ion:people"
                size={20}
                color={theme.colors.primary}
              />
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.onSurface,
                  marginLeft: 8,
                  fontWeight: "600",
                }}
              >
                {totalDeportistas}{" "}
                {totalDeportistas === 1 ? "Deportista" : "Deportistas"}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Icon
                source="ion:school"
                size={20}
                color={theme.colors.secondary}
              />
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.onSurface,
                  marginLeft: 8,
                  fontWeight: "600",
                }}
              >
                {totalEntrenadores}{" "}
                {totalEntrenadores === 1 ? "Entrenador" : "Entrenadores"}
              </Text>
            </View>
          </View>

          {/* Lista de Deportistas */}
          {aval.deportistas.length > 0 && (
            <>
              <Divider style={{ marginVertical: 16 }} />
              <Text
                variant="titleSmall"
                style={{
                  color: theme.colors.onSurface,
                  marginBottom: 12,
                  fontWeight: "600",
                }}
              >
                Lista de Deportistas
              </Text>
              {aval.deportistas.map((deportista, index) => (
                <Surface
                  key={deportista.id}
                  style={[
                    styles.deportistaCard,
                    { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                  elevation={0}
                >
                  <View style={styles.deportistaInfo}>
                    <View
                      style={[
                        styles.deportistaAvatar,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    >
                      <Text
                        variant="bodyLarge"
                        style={{
                          color: theme.colors.onPrimary,
                          fontWeight: "700",
                        }}
                      >
                        {deportista.nombre.charAt(0)}
                        {deportista.apellido.charAt(0)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        variant="bodyMedium"
                        style={{
                          color: theme.colors.onSurface,
                          fontWeight: "600",
                        }}
                      >
                        {deportista.nombre} {deportista.apellido}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        CI: {deportista.cedula} •{" "}
                        {deportista.sexo === "M" ? "Masculino" : "Femenino"}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        {deportista.categoria}
                      </Text>
                    </View>
                  </View>
                </Surface>
              ))}
            </>
          )}
        </Card.Content>
      </Card>

      {/* Documento */}
      {aval.documentoUrl && (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text
              variant="titleMedium"
              style={{
                color: theme.colors.onSurface,
                marginBottom: 12,
                fontWeight: "700",
              }}
            >
              Documento
            </Text>
            <Surface
              style={[
                styles.documentCard,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
              elevation={0}
            >
              <Icon
                source="ion:document-text"
                size={40}
                color={theme.colors.primary}
              />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurface, fontWeight: "600" }}
                >
                  {aval.documentoNombre || "Solicitud de Aval.pdf"}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Documento adjunto
                </Text>
              </View>
              <Button
                mode="contained-tonal"
                onPress={handleDownloadDocument}
                icon="ion:download"
                compact
              >
                Descargar
              </Button>
            </Surface>
          </Card.Content>
        </Card>
      )}

      {/* Fechas y Estado */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.onSurface,
              marginBottom: 16,
              fontWeight: "700",
            }}
          >
            Historial
          </Text>

          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineDot,
                { backgroundColor: theme.colors.primary },
              ]}
            />
            <View style={styles.timelineContent}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurface, fontWeight: "600" }}
              >
                Solicitud enviada
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {new Date(aval.fechaSolicitud).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>

          {aval.fechaAprobacion && (
            <View style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineDot,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
              <View style={styles.timelineContent}>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurface, fontWeight: "600" }}
                >
                  Aval aprobado
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  {new Date(aval.fechaAprobacion).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>
          )}

          {aval.fechaRechazo && aval.motivoRechazo && (
            <View style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineDot,
                  { backgroundColor: theme.colors.error },
                ]}
              />
              <View style={styles.timelineContent}>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.error, fontWeight: "600" }}
                >
                  Aval rechazado
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  {new Date(aval.fechaRechazo).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.error, marginTop: 4 }}
                >
                  Motivo: {aval.motivoRechazo}
                </Text>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Actions */}
      {aval.status === "approved" && (
        <View style={styles.actionsContainer}>
          {aval.documentoUrl && (
            <Button
              mode="contained"
              onPress={handleDownloadDocument}
              icon="ion:download"
              style={styles.actionButton}
            >
              Descargar PDF
            </Button>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  title: {
    fontWeight: "700",
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerBadges: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusChip: {
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  deportistaCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  deportistaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deportistaAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
  },
});
