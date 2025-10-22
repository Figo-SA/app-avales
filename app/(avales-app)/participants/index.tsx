import { Evento } from "@/core/eventos/interfaces/evento";
import { AgregarParticipanteModal } from "@/presentation/participants/components/AgregarParticipanteModal";
import { CategoriaSection } from "@/presentation/participants/components/CategoriaSection";
import { useParticipantes } from "@/presentation/participants/hooks/useParticipantes";
import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Divider, Icon, Surface, Text, useTheme } from "react-native-paper";

export default function ParticipantsScreen() {
  const params = useLocalSearchParams();
  const evento: Evento | null = params.evento
    ? JSON.parse(params.evento as string)
    : null;
  const theme = useTheme();
  const styles = createStyles(theme);

  if (!evento) {
    return null;
  }

  const {
    participantes,
    progreso,
    modalState,
    abrirModal,
    cerrarModal,
    agregarParticipantes,
    eliminarParticipante,
    todoCompleto,
  } = useParticipantes(evento);

  return (
    <>
      <Stack.Screen
        options={{
          title: evento.evento,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.onPrimary,
          headerBackTitle: "Volver",
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            Gestionar Participantes
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {evento.evento}
          </Text>
        </View>

        <Surface style={styles.progresoCard} elevation={1}>
          <View style={styles.progresoHeader}>
            <Icon
              source={todoCompleto ? "ion:checkmark-circle" : "ion:time"}
              size={24}
              color={todoCompleto ? "#4CAF50" : theme.colors.primary}
            />
            <Text variant="titleMedium" style={styles.progresoTitle}>
              {todoCompleto ? "¡Completado!" : "En Progreso"}
            </Text>
          </View>
          <Text variant="bodySmall" style={styles.progresoDescription}>
            {todoCompleto
              ? "Todos los participantes han sido agregados"
              : "Agrega todos los participantes requeridos para continuar"}
          </Text>
        </Surface>

        <Divider style={styles.divider} />

        {evento.numeroEntrenadoresHombres > 0 && (
          <CategoriaSection
            titulo="Entrenadores Hombres"
            icono="fa:user-tie"
            color={theme.colors.primary}
            progreso={progreso.entrenadoresHombres}
            participantes={participantes.entrenadoresHombres}
            onAgregar={() => abrirModal("entrenador", "masculino")}
            onEliminar={(id) => eliminarParticipante("entrenadoresHombres", id)}
          />
        )}

        {evento.numeroEntrenadoresMujeres > 0 && (
          <CategoriaSection
            titulo="Entrenadoras Mujeres"
            icono="fa:user-tie"
            color="#E91E63"
            progreso={progreso.entrenadoresMujeres}
            participantes={participantes.entrenadoresMujeres}
            onAgregar={() => abrirModal("entrenador", "femenino")}
            onEliminar={(id) => eliminarParticipante("entrenadoresMujeres", id)}
          />
        )}

        {evento.numeroAtletasHombres > 0 && (
          <CategoriaSection
            titulo="Atletas Hombres"
            icono="ion:person"
            color="#2196F3"
            progreso={progreso.atletasHombres}
            participantes={participantes.atletasHombres}
            onAgregar={() => abrirModal("atleta", "masculino")}
            onEliminar={(id) => eliminarParticipante("atletasHombres", id)}
          />
        )}

        {evento.numeroAtletasMujeres > 0 && (
          <CategoriaSection
            titulo="Atletas Mujeres"
            icono="ion:person"
            color="#9C27B0"
            progreso={progreso.atletasMujeres}
            participantes={participantes.atletasMujeres}
            onAgregar={() => abrirModal("atleta", "femenino")}
            onEliminar={(id) => eliminarParticipante("atletasMujeres", id)}
          />
        )}

        <View style={styles.actionsContainer}>
          <ThemeButton
            mode="outlined"
            onPress={() => router.back()}
            style={styles.button}
          >
            Cancelar
          </ThemeButton>
          <ThemeButton
            mode="contained"
            disabled={!todoCompleto}
            onPress={() => {
              console.log("Guardar participantes:", participantes);
              router.back();
            }}
            style={styles.button}
          >
            Guardar
          </ThemeButton>
        </View>

        <View style={styles.bottomPadding} />

        {/* Modal para agregar participante */}
        {modalState.visible &&
          modalState.tipo &&
          modalState.sexo &&
          (() => {
            const { tipo, sexo } = modalState;
            let cantidadRequerida = 0;
            let cantidadActual = 0;
            let participantesYaAgregados: any[] = [];

            if (tipo === "entrenador" && sexo === "masculino") {
              cantidadRequerida = evento.numeroEntrenadoresHombres;
              cantidadActual = participantes.entrenadoresHombres.length;
              participantesYaAgregados = participantes.entrenadoresHombres;
            } else if (tipo === "entrenador" && sexo === "femenino") {
              cantidadRequerida = evento.numeroEntrenadoresMujeres;
              cantidadActual = participantes.entrenadoresMujeres.length;
              participantesYaAgregados = participantes.entrenadoresMujeres;
            } else if (tipo === "atleta" && sexo === "masculino") {
              cantidadRequerida = evento.numeroAtletasHombres;
              cantidadActual = participantes.atletasHombres.length;
              participantesYaAgregados = participantes.atletasHombres;
            } else if (tipo === "atleta" && sexo === "femenino") {
              cantidadRequerida = evento.numeroAtletasMujeres;
              cantidadActual = participantes.atletasMujeres.length;
              participantesYaAgregados = participantes.atletasMujeres;
            }

            return (
              <AgregarParticipanteModal
                visible={modalState.visible}
                onDismiss={cerrarModal}
                tipo={tipo}
                sexo={sexo}
                cantidadRequerida={cantidadRequerida}
                cantidadActual={cantidadActual}
                participantesYaAgregados={participantesYaAgregados}
                onAgregar={agregarParticipantes}
              />
            );
          })()}
      </ScrollView>
    </>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 20,
      paddingBottom: 12,
    },
    title: {
      fontWeight: "700",
      color: theme.colors.onSurface,
      marginBottom: 4,
    },
    subtitle: {
      color: theme.colors.onSurfaceVariant,
    },
    progresoCard: {
      marginHorizontal: 20,
      padding: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
    },
    progresoHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    progresoTitle: {
      fontWeight: "600",
      color: theme.colors.onSurface,
    },
    progresoDescription: {
      color: theme.colors.onSurfaceVariant,
    },
    divider: {
      marginVertical: 16,
    },
    actionsContainer: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    button: {
      flex: 1,
    },
    bottomPadding: {
      height: 40,
    },
  });
