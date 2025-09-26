import Paso1DatosEvento from "@/presentation/aval/components/Paso1DatosEvento";
import Paso2DetallesTecnicos from "@/presentation/aval/components/Paso2DetallesTecnicos";
import Paso3Deportistas from "@/presentation/aval/components/Paso3Deportistas";
import Paso4ObjetivosCriterios from "@/presentation/aval/components/Paso4ObjetivosCriterios";
import Paso5RequerimientosFinancieros from "@/presentation/aval/components/Paso5RequerimientosFinancieros";
import Paso6DocumentosConfirmacion from "@/presentation/aval/components/Paso6DocumentosConfirmacion";
import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import { SolicitudCompleta } from "@/types/AvalTypes";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { ProgressBar, Text, useTheme } from "react-native-paper";

export default function NuevoAvalScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [pasoActual, setPasoActual] = useState(1);
  const [solicitud, setSolicitud] = useState<SolicitudCompleta>({
    coleccionAval: {
      descripcion: "",
      disciplina: "",
      categoria: "",
      genero: "",
      nombreEvento: "",
      lugar: "",
    },
    avalTecnico: {
      fechaSalida: new Date(),
      horaSalida: "",
      fechaRetorno: new Date(),
      horaRetorno: "",
      transporteSalida: "",
      transporteRetorno: "",
      numeroOficiales: 0,
      numeroAtletas: 0,
    },
    deportistas: [],
    objetivos: [],
    criterios: [],
    requerimientos: [],
    documento: null,
  });

  const totalPasos = 6;
  const progreso = pasoActual / totalPasos;

  const actualizarSolicitud = (
    seccion: keyof SolicitudCompleta,
    datos: any
  ) => {
    setSolicitud((prev) => ({
      ...prev,
      [seccion]: datos,
    }));
  };

  const siguientePaso = () => {
    if (pasoActual < totalPasos) setPasoActual((prev) => prev + 1);
  };

  const pasoAnterior = () => {
    if (pasoActual > 1) setPasoActual((prev) => prev - 1);
  };

  const confirmarCancelacion = () => {
    Alert.alert(
      "Cancelar Solicitud",
      "¿Estás seguro de que quieres cancelar? Se perderán todos los datos.",
      [
        { text: "No", style: "cancel" },
        { text: "Sí", style: "destructive", onPress: () => router.back() },
      ]
    );
  };

  const enviarSolicitud = async () => {
    try {
      console.log("Enviando solicitud:", solicitud);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert("Éxito", "Solicitud enviada correctamente");
      router.back();
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      Alert.alert("Error", "No se pudo enviar la solicitud. Intenta de nuevo.");
    }
  };

  const renderizarPaso = () => {
    switch (pasoActual) {
      case 1:
        return (
          <Paso1DatosEvento
            datos={solicitud.coleccionAval}
            onDatosChange={(datos) =>
              actualizarSolicitud("coleccionAval", datos)
            }
          />
        );
      case 2:
        return (
          <Paso2DetallesTecnicos
            datos={solicitud.avalTecnico}
            onDatosChange={(datos) => actualizarSolicitud("avalTecnico", datos)}
          />
        );
      case 3:
        return (
          <Paso3Deportistas
            deportistas={solicitud.deportistas}
            numeroAtletasRequerido={solicitud.avalTecnico.numeroAtletas || 0}
            onDeportistasChange={(datos) =>
              actualizarSolicitud("deportistas", datos)
            }
          />
        );
      case 4:
        return (
          <Paso4ObjetivosCriterios
            objetivos={solicitud.objetivos}
            criterios={solicitud.criterios}
            onObjetivosChange={(datos) =>
              actualizarSolicitud("objetivos", datos)
            }
            onCriteriosChange={(datos) =>
              actualizarSolicitud("criterios", datos)
            }
          />
        );
      case 5:
        return (
          <Paso5RequerimientosFinancieros
            requerimientos={solicitud.requerimientos}
            onRequerimientosChange={(datos) =>
              actualizarSolicitud("requerimientos", datos)
            }
          />
        );
      case 6:
        return (
          <Paso6DocumentosConfirmacion
            solicitud={solicitud}
            onDocumentoChange={(documento) =>
              actualizarSolicitud("documento", documento)
            }
          />
        );
      default:
        return null;
    }
  };

  // Estilos dinámicos que dependen del tema
  const dynamicStyles = {
    controls: {
      borderTopColor: theme.colors.outlineVariant || "rgba(0, 0, 0, 0.12)",
    },
    progressBar: {
      backgroundColor: theme.colors.surfaceVariant,
    },
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
          Paso {pasoActual} de {totalPasos}
        </Text>
        <ThemeButton
          mode="text"
          onPress={confirmarCancelacion}
          textColor={theme.colors.error}
          compact
        >
          Cancelar
        </ThemeButton>
      </View>

      <ProgressBar
        progress={progreso}
        color={theme.colors.primary}
        style={[styles.progressBar, dynamicStyles.progressBar]}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainerScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderizarPaso()}
      </ScrollView>

      <View style={[styles.controls, dynamicStyles.controls]}>
        {pasoActual > 1 && (
          <ThemeButton
            mode="outlined"
            onPress={pasoAnterior}
            style={styles.controlButton}
            icon="fa:arrow-left"
          >
            Anterior
          </ThemeButton>
        )}

        {pasoActual === 1 && <View style={styles.spacer} />}

        {pasoActual < totalPasos ? (
          <ThemeButton
            mode="contained"
            onPress={siguientePaso}
            style={styles.controlButton}
            iconPosition="right"
            icon="fa:arrow-right"
          >
            Siguiente
          </ThemeButton>
        ) : (
          <ThemeButton
            mode="contained"
            onPress={enviarSolicitud}
            icon="send"
            style={styles.controlButton}
          >
            Enviar Solicitud
          </ThemeButton>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
  },
  progressBar: {
    height: 5,
    marginBottom: 16,
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  contentContainerScroll: {
    paddingBottom: 16,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
  },
  controlButton: {
    minWidth: 120,
    marginHorizontal: 4,
  },
  spacer: {
    flex: 1,
  },
});
