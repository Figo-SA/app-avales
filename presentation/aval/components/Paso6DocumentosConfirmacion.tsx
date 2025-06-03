import { SolicitudCompleta } from "@/types/AvalTypes";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Card,
  Chip,
  Divider,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";

interface Props {
  solicitud: SolicitudCompleta;
  onDocumentoChange: (documento: any) => void;
}

export default function Paso6DocumentosConfirmacion({
  solicitud,
  onDocumentoChange,
}: Props) {
  const theme = useTheme();
  const [cargandoDocumento, setCargandoDocumento] = useState(false);

  const seleccionarDocumento = async () => {
    try {
      setCargandoDocumento(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const documento = result.assets[0];

        // Verificar tamaño (máximo 5MB)
        if (documento.size && documento.size > 5 * 1024 * 1024) {
          Alert.alert(
            "Archivo muy grande",
            "El archivo debe ser menor a 5MB. Por favor selecciona otro archivo."
          );
          return;
        }

        onDocumentoChange(documento);
        Alert.alert(
          "¡Documento cargado!",
          "El archivo se ha subido correctamente.",
          [{ text: "Continuar", style: "default" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo cargar el documento. Intenta nuevamente."
      );
    } finally {
      setCargandoDocumento(false);
    }
  };

  const eliminarDocumento = () => {
    Alert.alert(
      "Eliminar documento",
      "¿Estás seguro de que quieres eliminar este documento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onDocumentoChange(null),
        },
      ]
    );
  };

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calcularTotalFinanciero = () => {
    return solicitud.requerimientos.reduce(
      (total, req) => total + req.cantidadDias * req.valorUnitario,
      0
    );
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const formatearTamaño = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2);
  };

  const obtenerEstadoComplecion = () => {
    const totalSecciones = 6;
    const seccionesCompletas = [
      solicitud.coleccionAval.nombreEvento,
      solicitud.avalTecnico.fechaSalida,
      solicitud.deportistas.length > 0,
      solicitud.objetivos.length > 0,
      solicitud.requerimientos.length > 0,
      solicitud.documento,
    ].filter(Boolean).length;

    return { completas: seccionesCompletas, total: totalSecciones };
  };

  const estado = obtenerEstadoComplecion();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text variant="headlineSmall" style={styles.title}>
        📋 Revisión y Confirmación
      </Text>

      {/* Estado de progreso */}
      <Card
        style={[
          styles.progressCard,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Card.Content>
          <View style={styles.progressHeader}>
            <View style={styles.progressInfo}>
              <Text variant="titleMedium" style={styles.progressTitle}>
                Progreso de la Solicitud
              </Text>
              <Text variant="bodyMedium" style={styles.progressText}>
                {estado.completas} de {estado.total} secciones completas
              </Text>
            </View>
            <View style={styles.progressIndicator}>
              <Text
                variant="headlineMedium"
                style={[
                  styles.progressPercentage,
                  {
                    color:
                      estado.completas === estado.total
                        ? theme.colors.primary
                        : theme.colors.outline,
                  },
                ]}
              >
                {Math.round((estado.completas / estado.total) * 100)}%
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Sección de documento */}
      <Card style={styles.documentCard}>
        <Card.Content>
          <View style={styles.documentHeader}>
            <IconButton
              icon="fa:file"
              size={32}
              iconColor={theme.colors.primary}
            />
            <View style={styles.documentHeaderText}>
              <Text variant="titleLarge" style={styles.documentTitle}>
                Documento Adjunto
              </Text>
              <Text variant="bodyMedium" style={styles.documentSubtitle}>
                Archivo PDF con información adicional del evento
              </Text>
            </View>
          </View>

          {!solicitud.documento ? (
            <View style={styles.uploadArea}>
              <TouchableOpacity
                onPress={seleccionarDocumento}
                style={[
                  styles.uploadButton,
                  { borderColor: theme.colors.primary },
                ]}
              >
                <IconButton
                  icon="cloud-upload"
                  size={48}
                  iconColor={theme.colors.primary}
                />
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.primary }}
                >
                  Subir Documento PDF
                </Text>
                <Text variant="bodySmall" style={styles.uploadHint}>
                  Toca para seleccionar un archivo (máx. 5MB)
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Card
              style={[
                styles.documentInfo,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Card.Content style={styles.documentInfoContent}>
                <View style={styles.documentDetails}>
                  <IconButton
                    icon="file-pdf-box"
                    size={40}
                    iconColor={theme.colors.primary}
                  />
                  <View style={styles.documentText}>
                    <Text variant="titleMedium" style={styles.documentName}>
                      {solicitud.documento.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.documentSize}>
                      {formatearTamaño(solicitud.documento.size || 0)} MB • PDF
                    </Text>
                  </View>
                </View>
                <View style={styles.documentActions}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={seleccionarDocumento}
                    iconColor={theme.colors.primary}
                  />
                  <IconButton
                    icon="trash-can"
                    size={20}
                    onPress={eliminarDocumento}
                    iconColor={theme.colors.error}
                  />
                </View>
              </Card.Content>
            </Card>
          )}

          <Text variant="bodySmall" style={styles.documentNote}>
            💡 El documento debe contener información complementaria sobre el
            evento, como reglamentos, cronogramas o detalles técnicos.
          </Text>
        </Card.Content>
      </Card>

      <Divider style={styles.sectionDivider} />

      {/* Resumen expandible */}
      <Text variant="headlineSmall" style={styles.summaryTitle}>
        📊 Resumen de la Solicitud
      </Text>

      {/* Datos del evento */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <View style={styles.summaryHeader}>
            <IconButton
              icon="fa:calendar-alt"
              size={24}
              iconColor={theme.colors.primary}
            />
            <Text variant="titleMedium" style={styles.summaryCardTitle}>
              Información del Evento
            </Text>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Evento:
              </Text>
              <Text variant="bodyMedium" style={styles.summaryValue}>
                {solicitud.coleccionAval.nombreEvento}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Disciplina:
              </Text>
              <Text variant="bodyMedium" style={styles.summaryValue}>
                {solicitud.coleccionAval.disciplina}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Categoría:
              </Text>
              <Text variant="bodyMedium" style={styles.summaryValue}>
                {solicitud.coleccionAval.categoria}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Lugar:
              </Text>
              <Text variant="bodyMedium" style={styles.summaryValue}>
                {solicitud.coleccionAval.lugar}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Detalles técnicos */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <View style={styles.summaryHeader}>
            <IconButton
              icon="hammer-outline"
              size={24}
              iconColor={theme.colors.secondary}
            />
            <Text variant="titleMedium" style={styles.summaryCardTitle}>
              Detalles Técnicos
            </Text>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Salida:
              </Text>
              <Text variant="bodyMedium" style={styles.summaryValue}>
                {formatearFecha(solicitud.avalTecnico.fechaSalida)}
              </Text>
              <Text variant="bodySmall" style={styles.summaryValue}>
                {solicitud.avalTecnico.horaSalida} •{" "}
                {solicitud.avalTecnico.transporteSalida}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Retorno:
              </Text>
              <Text variant="bodyMedium" style={styles.summaryValue}>
                {formatearFecha(solicitud.avalTecnico.fechaRetorno)}
              </Text>
              <Text variant="bodySmall" style={styles.summaryValue}>
                {solicitud.avalTecnico.horaRetorno} •{" "}
                {solicitud.avalTecnico.transporteRetorno}
              </Text>
            </View>
          </View>
          <View style={styles.participantesRow}>
            <Chip
              icon="fa:users"
              style={{ backgroundColor: theme.colors.primaryContainer }}
            >
              {solicitud.avalTecnico.numeroOficiales} Oficiales
            </Chip>
            <Chip
              icon="fa:running"
              style={{ backgroundColor: theme.colors.tertiaryContainer }}
            >
              {solicitud.avalTecnico.numeroAtletas} Atletas
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {/* Deportistas */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <View style={styles.summaryHeader}>
            <IconButton
              icon="fa:users"
              size={24}
              iconColor={theme.colors.primary}
            />
            <Text variant="titleMedium" style={styles.summaryCardTitle}>
              Deportistas Seleccionados ({solicitud.deportistas.length})
            </Text>
          </View>
          <View style={styles.deportistasList}>
            {solicitud.deportistas.slice(0, 5).map((deportista, index) => (
              <Chip
                key={index}
                icon="fa:user"
                style={[
                  styles.deportistaChip,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
              >
                {deportista.nombre}
              </Chip>
            ))}
            {solicitud.deportistas.length > 5 && (
              <Chip style={{ backgroundColor: theme.colors.outline }}>
                +{solicitud.deportistas.length - 5} más
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Objetivos y Criterios en una sola card */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <View style={styles.summaryHeader}>
            <IconButton
              icon="star-outline"
              size={24}
              iconColor={theme.colors.secondary}
            />
            <Text variant="titleMedium" style={styles.summaryCardTitle}>
              Objetivos y Criterios
            </Text>
          </View>

          {/* Objetivos */}
          <View style={styles.subsection}>
            <Text variant="titleSmall" style={styles.subsectionTitle}>
              🎯 Objetivos ({solicitud.objetivos.length})
            </Text>
            {solicitud.objetivos.slice(0, 3).map((objetivo, index) => (
              <Text key={index} variant="bodyMedium" style={styles.listItem}>
                • {objetivo.descripcion}
              </Text>
            ))}
            {solicitud.objetivos.length > 3 && (
              <Text variant="bodySmall" style={styles.moreItems}>
                ... y {solicitud.objetivos.length - 3} objetivos más
              </Text>
            )}
          </View>

          {/* Criterios */}
          <View style={styles.subsection}>
            <Text variant="titleSmall" style={styles.subsectionTitle}>
              📊 Criterios ({solicitud.criterios.length})
            </Text>
            {solicitud.criterios.slice(0, 3).map((criterio, index) => (
              <Text key={index} variant="bodyMedium" style={styles.listItem}>
                • {criterio.descripcion}
              </Text>
            ))}
            {solicitud.criterios.length > 3 && (
              <Text variant="bodySmall" style={styles.moreItems}>
                ... y {solicitud.criterios.length - 3} criterios más
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Resumen financiero destacado */}
      <Card
        style={[
          styles.financialCard,
          { backgroundColor: theme.colors.primary },
        ]}
      >
        <Card.Content>
          <View style={styles.financialHeader}>
            <IconButton
              icon="calculator"
              size={32}
              iconColor={theme.colors.onPrimary}
            />
            <View style={styles.financialText}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.onPrimary }}
              >
                Resumen Financiero
              </Text>
              <Text
                variant="headlineMedium"
                style={[styles.totalAmount, { color: theme.colors.onPrimary }]}
              >
                {formatearMoneda(calcularTotalFinanciero())}
              </Text>
            </View>
          </View>
          <View style={styles.financialDetails}>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onPrimary, opacity: 0.9 }}
            >
              {solicitud.requerimientos.length} rubros presupuestarios
            </Text>
            {solicitud.requerimientos.slice(0, 3).map((req, index) => (
              <Text
                key={index}
                variant="bodySmall"
                style={{ color: theme.colors.onPrimary, opacity: 0.8 }}
              >
                • {req.rubro}:{" "}
                {formatearMoneda(req.cantidadDias * req.valorUnitario)}
              </Text>
            ))}
            {solicitud.requerimientos.length > 3 && (
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onPrimary, opacity: 0.8 }}
              >
                ... y {solicitud.requerimientos.length - 3} rubros más
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Estado final y mensaje */}
      <Card
        style={[
          styles.statusCard,
          {
            backgroundColor:
              estado.completas === estado.total
                ? theme.colors.primaryContainer
                : theme.colors.errorContainer,
          },
        ]}
      >
        <Card.Content style={styles.statusContent}>
          <IconButton
            icon={
              estado.completas === estado.total
                ? "check-circle"
                : "alert-circle"
            }
            size={32}
            iconColor={
              estado.completas === estado.total
                ? theme.colors.primary
                : theme.colors.error
            }
          />
          <View style={styles.statusText}>
            <Text variant="titleMedium" style={styles.statusTitle}>
              {estado.completas === estado.total
                ? "¡Solicitud Lista!"
                : "Faltan Datos"}
            </Text>
            <Text variant="bodyMedium" style={styles.statusMessage}>
              {estado.completas === estado.total
                ? "Tu solicitud está completa y lista para enviar."
                : `Completa todas las secciones para continuar.`}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Espaciado final */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  progressCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontWeight: "600",
  },
  progressText: {
    opacity: 0.7,
  },
  progressIndicator: {
    alignItems: "center",
  },
  progressPercentage: {
    fontWeight: "bold",
  },
  documentCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  documentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  documentHeaderText: {
    flex: 1,
    marginLeft: 8,
  },
  documentTitle: {
    fontWeight: "600",
  },
  documentSubtitle: {
    opacity: 0.7,
  },
  uploadArea: {
    marginBottom: 12,
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  uploadHint: {
    opacity: 0.7,
    textAlign: "center",
  },
  documentInfo: {
    marginBottom: 12,
    elevation: 1,
    borderRadius: 8,
  },
  documentInfoContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  documentDetails: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  documentText: {
    marginLeft: 8,
    flex: 1,
  },
  documentName: {
    fontWeight: "600",
  },
  documentSize: {
    opacity: 0.7,
  },
  documentActions: {
    flexDirection: "row",
  },
  documentNote: {
    opacity: 0.7,
    fontStyle: "italic",
    textAlign: "center",
  },
  sectionDivider: {
    marginVertical: 24,
  },
  summaryTitle: {
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryCardTitle: {
    marginLeft: 8,
    fontWeight: "600",
  },
  summaryGrid: {
    gap: 12,
  },
  summaryItem: {
    gap: 4,
  },
  summaryLabel: {
    opacity: 0.7,
    fontWeight: "500",
  },
  summaryValue: {
    fontWeight: "400",
  },
  participantesRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  deportistasList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  deportistaChip: {
    marginBottom: 4,
  },
  subsection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    marginBottom: 8,
    fontWeight: "600",
  },
  listItem: {
    marginBottom: 4,
    lineHeight: 20,
  },
  moreItems: {
    opacity: 0.7,
    fontStyle: "italic",
    marginTop: 4,
  },
  financialCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 16,
  },
  financialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  financialText: {
    marginLeft: 8,
    flex: 1,
  },
  totalAmount: {
    fontWeight: "bold",
    fontSize: 24,
  },
  financialDetails: {
    gap: 4,
  },
  statusCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  statusContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontWeight: "600",
  },
  statusMessage: {
    opacity: 0.8,
  },
  bottomSpacing: {
    height: 32,
  },
});
