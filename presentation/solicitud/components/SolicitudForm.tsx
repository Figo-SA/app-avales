import { Participante } from "@/core/participants/interfaces/participante";
import { useEventos } from "@/presentation/event/hooks/useEvento";
import { AgregarParticipanteModal } from "@/presentation/participants/components/AgregarParticipanteModal";
import { DateTimeInput } from "@/presentation/solicitud/components/DateTimeInput";
import { SolicitudPreviewHtml } from "@/presentation/solicitud/components/SolicitudPreviewHtml";
import { TransporteSelector } from "@/presentation/solicitud/components/TransporteSelector";
import { useSolicitud } from "@/presentation/solicitud/hooks/useSolicitud";
import { useSolicitudMutation } from "@/presentation/solicitud/hooks/useSolicitudMutation";
import { useSolicitudDraftStore } from "@/presentation/solicitud/store/useSolicitudDraftStore";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Button,
  Chip,
  Divider,
  Icon,
  ProgressBar,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

interface SolicitudFormProps {
  eventoId: string;
  initialStep?: number;
  coleccionId?: number;
}

export const SolicitudForm = ({ eventoId, initialStep = 1, coleccionId }: SolicitudFormProps) => {
  const theme = useTheme();
  const { eventoQuery } = useEventos(eventoId);
  const evento = eventoQuery.data;
  const solicitudMutation = useSolicitudMutation();
  const { clearDraft } = useSolicitudDraftStore();

  // Usar el hook personalizado para toda la lógica del formulario
  const {
    step,
    totalSteps,
    formData,
    errors,
    control,
    handleNext,
    handleBack,
    updateFormData,
    updateArrayItem,
    addArrayItem,
    canContinue,
    isUploading,
    isDraftLoading,
  } = useSolicitud(eventoId, initialStep, coleccionId);

  const [documento, setDocumento] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [certificadoMedicoLocal, setCertificadoMedicoLocal] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  // Limpiar estados locales cuando cambia el evento
  useEffect(() => {
    setDocumento(null);
    setCertificadoMedicoLocal(null);
    setDeportistasSeleccionados([]);
    setEntrenadoresSeleccionados([]);
  }, [eventoId]);

  const [modalState, setModalState] = useState<{
    visible: boolean;
    tipo: "atleta" | "entrenador" | null;
    sexo: "masculino" | "femenino" | null;
  }>({
    visible: false,
    tipo: null,
    sexo: null,
  });

  const [deportistasSeleccionados, setDeportistasSeleccionados] = useState<
    Participante[]
  >([]);
  const [entrenadoresSeleccionados, setEntrenadoresSeleccionados] = useState<
    Participante[]
  >([]);
  


  // Validar si los participantes están completos según el evento
  const validarParticipantesCompletos = () => {
    if (!evento) return { completo: false, mensaje: "" };

    const deportistasHombresCant = deportistasSeleccionados.filter(
      (d) => d.sexo === "masculino"
    ).length;
    const deportistasMujeresCant = deportistasSeleccionados.filter(
      (d) => d.sexo === "femenino"
    ).length;
    const entrenadoresHombresCant = entrenadoresSeleccionados.filter(
      (e) => e.sexo === "masculino"
    ).length;
    const entrenadoresMujeresCant = entrenadoresSeleccionados.filter(
      (e) => e.sexo === "femenino"
    ).length;

    const faltantes: string[] = [];

    if (deportistasHombresCant < evento.numAtletasHombres) {
      faltantes.push(
        `${evento.numAtletasHombres - deportistasHombresCant} atleta(s) hombre(s)`
      );
    }
    if (deportistasMujeresCant < evento.numAtletasMujeres) {
      faltantes.push(
        `${evento.numAtletasMujeres - deportistasMujeresCant} atleta(s) mujer(es)`
      );
    }
    if (entrenadoresHombresCant < evento.numEntrenadoresHombres) {
      faltantes.push(
        `${evento.numEntrenadoresHombres - entrenadoresHombresCant} entrenador(es) hombre(s)`
      );
    }
    if (entrenadoresMujeresCant < evento.numEntrenadoresMujeres) {
      faltantes.push(
        `${evento.numEntrenadoresMujeres - entrenadoresMujeresCant} entrenador(es) mujer(es)`
      );
    }

    return {
      completo: faltantes.length === 0,
      mensaje: faltantes.length > 0 ? `Faltan: ${faltantes.join(", ")}` : "",
    };
  };

  const participantesValidacion = validarParticipantesCompletos();

  const abrirModal = (
    tipo: "atleta" | "entrenador",
    sexo: "masculino" | "femenino"
  ) => {
    setModalState({ visible: true, tipo, sexo });
  };

  const cerrarModal = () => {
    setModalState({ visible: false, tipo: null, sexo: null });
  };

  const seleccionarDocumento = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setDocumento({
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/pdf",
        });
        updateFormData("documento", file);
      }
    } catch (error) {
      console.error("Error al seleccionar documento:", error);
      toast.error("No se pudo seleccionar el documento");
    }
  };

  const seleccionarCertificadoMedico = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setCertificadoMedicoLocal({
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/pdf",
        });
        updateFormData("certificadoMedico", file);
      }
    } catch (error) {
      console.error("Error al seleccionar certificado médico:", error);
      toast.error("No se pudo seleccionar el certificado médico");
    }
  };




  const onSubmit = async () => {

    if (!formData.fechaSalida || !formData.fechaRetorno) {
      toast.error("Las fechas son requeridas");
      return;
    }

    if (!formData.coleccionAvalId) {
      toast.error(
        "No se ha creado la colección de aval. Intenta subir el documento nuevamente."
      );
      return;
    }

    try {
      // Transformar los datos al formato de la API
      const solicitudData = {
        coleccionAvalId: formData.coleccionAvalId,
        fechaHoraSalida: formData.fechaSalida.toISOString(),
        fechaHoraRetorno: formData.fechaRetorno.toISOString(),
        lugarSalida: formData.lugarSalida,
        lugarRetorno: formData.lugarRetorno,
        transporteSalida: formData.transporteSalida,
        transporteRetorno: formData.transporteRetorno,
        observaciones: formData.observaciones || "",
        objetivos: formData.objetivos
          .filter((obj) => obj.trim())
          .map((descripcion, index) => ({ orden: index + 1, descripcion })),
        criterios: formData.criterios
          .filter((crit) => crit.trim())
          .map((descripcion, index) => ({ orden: index + 1, descripcion })),
        deportistas: formData.deportistas.map((id) => ({
          deportistaId: Number(id),
          rol: "ATLETA",
        })),
        entrenadores: formData.entrenadores.map((id, index) => ({
          entrenadorId: Number(id),
          rol: index === 0 ? "ENTRENADOR PRINCIPAL" : "ENTRENADOR",
          esPrincipal: index === 0,
        })),
      };

      await solicitudMutation.mutateAsync({
        eventoId: Number(eventoId),
        solicitudData,
      });

      await clearDraft(eventoId);
      toast.success("Solicitud enviada correctamente");
      router.back();
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo enviar la solicitud"
      );
    }
  };

  const agregarDeportistas = (participantes: Participante[]) => {
    const nuevosDeportistas = [...deportistasSeleccionados, ...participantes];
    setDeportistasSeleccionados(nuevosDeportistas);
    // Actualizar el formulario con los IDs
    updateFormData(
      "deportistas",
      nuevosDeportistas.map((p) => p.id)
    );
  };

  const agregarEntrenadores = (participantes: Participante[]) => {
    const nuevosEntrenadores = [...entrenadoresSeleccionados, ...participantes];
    setEntrenadoresSeleccionados(nuevosEntrenadores);
    // Actualizar el formulario con los IDs
    updateFormData(
      "entrenadores",
      nuevosEntrenadores.map((p) => p.id)
    );
  };

  const eliminarDeportista = (id: string) => {
    const nuevosDeportistas = deportistasSeleccionados.filter(
      (p) => p.id !== id
    );
    setDeportistasSeleccionados(nuevosDeportistas);
    updateFormData(
      "deportistas",
      nuevosDeportistas.map((p) => p.id)
    );
  };

  const eliminarEntrenador = (id: string) => {
    const nuevosEntrenadores = entrenadoresSeleccionados.filter(
      (p) => p.id !== id
    );
    setEntrenadoresSeleccionados(nuevosEntrenadores);
    updateFormData(
      "entrenadores",
      nuevosEntrenadores.map((p) => p.id)
    );
  };

  const renderStepIndicator = () => {
    if (step === 1) return null;

    const currentStep = step - 1;
    const totalFormSteps = totalSteps - 1;

    return (
      <View style={styles.stepIndicator}>
        <View style={styles.stepHeader}>
          <ThemedText style={styles.stepText}>
            Paso {currentStep} de {totalFormSteps}
          </ThemedText>
          <ThemedText style={styles.stepPercentage}>
            {Math.round((currentStep / totalFormSteps) * 100)}%
          </ThemedText>
        </View>
        <ProgressBar
          progress={currentStep / totalFormSteps}
          color={theme.colors.primary}
          style={styles.progressBar}
        />
      </View>
    );
  };

  const renderStepFechas = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepTitleContainer}>
        <Icon source="ion:calendar" size={24} color={theme.colors.primary} />
        <ThemedText style={styles.stepTitle}>Fechas y Transporte</ThemedText>
      </View>

      <ThemedText style={styles.helperText}>
        Define las fechas de salida y retorno, así como el medio de transporte
      </ThemedText>

      <DateTimeInput
        control={control}
        name="fechaSalida"
        label="Fecha y Hora de Salida *"
        placeholder="Seleccione fecha y hora"
        icon="ion:calendar-outline"
        mode="datetime"
        error={errors.fechaSalida?.message}
      />

      <DateTimeInput
        control={control}
        name="fechaRetorno"
        label="Fecha y Hora de Retorno *"
        placeholder="Seleccione fecha y hora"
        icon="ion:calendar-outline"
        mode="datetime"
        minimumDate={formData.fechaSalida}
        error={errors.fechaRetorno?.message}
      />

      <TextInput
        label="Lugar de Salida *"
        mode="outlined"
        value={formData.lugarSalida}
        onChangeText={(text) => updateFormData("lugarSalida", text)}
        placeholder="Ej: Terminal Terrestre de Loja"
        error={!!errors.lugarSalida}
      />
      {errors.lugarSalida && (
        <Text variant="bodySmall" style={{ color: theme.colors.error, marginTop: -8 }}>
          {errors.lugarSalida.message}
        </Text>
      )}

      <TextInput
        label="Lugar de Retorno *"
        mode="outlined"
        value={formData.lugarRetorno}
        onChangeText={(text) => updateFormData("lugarRetorno", text)}
        placeholder="Ej: Terminal Terrestre de Quito"
        error={!!errors.lugarRetorno}
      />
      {errors.lugarRetorno && (
        <Text variant="bodySmall" style={{ color: theme.colors.error, marginTop: -8 }}>
          {errors.lugarRetorno.message}
        </Text>
      )}

      <TransporteSelector
        control={control}
        name="transporteSalida"
        label="Transporte de Salida *"
        placeholder="Seleccione medio de transporte"
        icon="bus"
        error={errors.transporteSalida?.message}
      />

      <TransporteSelector
        control={control}
        name="transporteRetorno"
        label="Transporte de Retorno *"
        placeholder="Seleccione medio de transporte"
        icon="bus"
        error={errors.transporteRetorno?.message}
      />
    </View>
  );

  const renderStepObjetivos = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepTitleContainer}>
        <Icon
          source="ion:flag-outline"
          size={24}
          color={theme.colors.primary}
        />
        <ThemedText style={styles.stepTitle}>Objetivos del Evento</ThemedText>
      </View>

      <ThemedText style={styles.helperText}>
        Agrega al menos 2 objetivos que esperas lograr en este evento
      </ThemedText>

      {formData.objetivos.map((objetivo, index) => (
        <TextInput
          key={index}
          label={`Objetivo ${index + 1} *`}
          mode="outlined"
          value={objetivo}
          onChangeText={(text) => updateArrayItem("objetivos", index, text)}
          placeholder={`Ej: ${index === 0 ? "Obtener ..." : "Clasificar ..."}`}
          multiline
        />
      ))}

      <Button
        mode="text"
        icon="ion:add-outline"
        onPress={() => addArrayItem("objetivos")}
        style={styles.addButton}
      >
        Agregar otro objetivo
      </Button>
    </View>
  );

  const renderStepCriterios = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepTitleContainer}>
        <Icon
          source="ion:checkmark-done"
          size={24}
          color={theme.colors.primary}
        />
        <ThemedText style={styles.stepTitle}>Criterios de Selección</ThemedText>
      </View>

      <ThemedText style={styles.helperText}>
        Define los criterios que usaste para seleccionar a los participantes
      </ThemedText>

      {formData.criterios.map((criterio, index) => (
        <TextInput
          key={index}
          label={`Criterio ${index + 1} *`}
          mode="outlined"
          value={criterio}
          onChangeText={(text) => updateArrayItem("criterios", index, text)}
          placeholder={`Ej: ${
            index === 0
              ? "Rendimiento en entrenamientos"
              : "Disciplina y compromiso"
          }`}
          multiline
          numberOfLines={2}
        />
      ))}

      <Button
        mode="text"
        icon="ion:add-outline"
        onPress={() => addArrayItem("criterios")}
        style={styles.addButton}
      >
        Agregar otro criterio
      </Button>
    </View>
  );

  const renderStepParticipantes = () => {
    if (!evento) return null;

    const deportistasHombresCant = deportistasSeleccionados.filter(
      (d) => d.sexo === "masculino"
    ).length;
    const deportistasMujeresCant = deportistasSeleccionados.filter(
      (d) => d.sexo === "femenino"
    ).length;
    const entrenadoresHombresCant = entrenadoresSeleccionados.filter(
      (e) => e.sexo === "masculino"
    ).length;
    const entrenadoresMujeresCant = entrenadoresSeleccionados.filter(
      (e) => e.sexo === "femenino"
    ).length;

    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepTitleContainer}>
          <Icon source="ion:people" size={24} color={theme.colors.primary} />
          <ThemedText style={styles.stepTitle}>Participantes</ThemedText>
        </View>

        <ThemedText style={styles.helperText}>
          Selecciona los deportistas y entrenadores que participarán
        </ThemedText>

        {/* Sección Deportistas */}
        <View style={styles.participantSection}>
          <View style={styles.participantHeader}>
            <ThemedText style={styles.participantTitle}>Deportistas</ThemedText>
            <ThemedText style={styles.participantCount}>
              {deportistasSeleccionados.length} seleccionados
            </ThemedText>
          </View>

          <View style={styles.buttonGroup}>
            {evento.numAtletasHombres > 0 && (
              <Button
                mode="outlined"
                icon="ion:man-outline"
                onPress={() => abrirModal("atleta", "masculino")}
                style={styles.genderButton}
                compact
              >
                Hombres ({deportistasHombresCant}/{evento.numAtletasHombres})
              </Button>
            )}
            {evento.numAtletasMujeres > 0 && (
              <Button
                mode="outlined"
                icon="ion:woman-outline"
                onPress={() => abrirModal("atleta", "femenino")}
                style={styles.genderButton}
                compact
              >
                Mujeres ({deportistasMujeresCant}/{evento.numAtletasMujeres})
              </Button>
            )}
          </View>

          {deportistasSeleccionados.length > 0 && (
            <View style={styles.chipsContainer}>
              {deportistasSeleccionados.map((deportista) => (
                <Chip
                  key={deportista.id}
                  mode="outlined"
                  icon={
                    deportista.sexo === "masculino"
                      ? "ion:man-outline"
                      : "ion:woman-outline"
                  }
                  onClose={() => eliminarDeportista(deportista.id)}
                  style={styles.chip}
                >
                  {deportista.nombres} {deportista.apellidos}
                </Chip>
              ))}
            </View>
          )}

          {errors.deportistas && (
            <Text
              variant="bodySmall"
              style={[styles.errorText, { color: theme.colors.error }]}
            >
              {errors.deportistas.message}
            </Text>
          )}
        </View>

        {/* Sección Entrenadores */}
        <View style={styles.participantSection}>
          <View style={styles.participantHeader}>
            <ThemedText style={styles.participantTitle}>
              Entrenadores
            </ThemedText>
            <ThemedText style={styles.participantCount}>
              {entrenadoresSeleccionados.length} seleccionados
            </ThemedText>
          </View>

          <View style={styles.buttonGroup}>
            {evento.numEntrenadoresHombres > 0 && (
              <Button
                mode="outlined"
                icon="ion:man-outline"
                onPress={() => abrirModal("entrenador", "masculino")}
                style={styles.genderButton}
                compact
              >
                Hombres ({entrenadoresHombresCant}/
                {evento.numEntrenadoresHombres})
              </Button>
            )}
            {evento.numEntrenadoresMujeres > 0 && (
              <Button
                mode="outlined"
                icon="ion:woman-outline"
                onPress={() => abrirModal("entrenador", "femenino")}
                style={styles.genderButton}
                compact
              >
                Mujeres ({entrenadoresMujeresCant}/
                {evento.numEntrenadoresMujeres})
              </Button>
            )}
          </View>

          {entrenadoresSeleccionados.length > 0 && (
            <View style={styles.chipsContainer}>
              {entrenadoresSeleccionados.map((entrenador) => (
                <Chip
                  key={entrenador.id}
                  mode="outlined"
                  icon={
                    entrenador.sexo === "masculino"
                      ? "ion:man-outline"
                      : "ion:woman-outline"
                  }
                  onClose={() => eliminarEntrenador(entrenador.id)}
                  style={styles.chip}
                >
                  {entrenador.nombres} {entrenador.apellidos}
                </Chip>
              ))}
            </View>
          )}

          {errors.entrenadores && (
            <Text
              variant="bodySmall"
              style={[styles.errorText, { color: theme.colors.error }]}
            >
              {errors.entrenadores.message}
            </Text>
          )}
        </View>

        {/* Mensaje de validación de participantes */}
        {!participantesValidacion.completo && (
          <Surface style={styles.warningBanner} elevation={0}>
            <Icon source="ion:alert-circle" size={20} color={theme.colors.error} />
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.error, flex: 1 }}
            >
              {participantesValidacion.mensaje}
            </Text>
          </Surface>
        )}
      </View>
    );
  };

  const renderStepDocumento = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepTitleContainer}>
        <Icon
          source="ion:document-text"
          size={24}
          color={theme.colors.primary}
        />
        <ThemedText style={styles.stepTitle}>Documentos Requeridos</ThemedText>
      </View>

      <View style={styles.infoBox}>
        <Icon source="ion:information-circle-outline" size={20} color={theme.colors.onSurfaceVariant} />
        <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
          Para iniciar tu solicitud de aval, debes subir la convocatoria oficial y el certificado médico.
          {"\n\n"}
          Una vez subidos, podrás completar el formulario con los detalles técnicos (fechas, objetivos y participantes).
        </Text>
      </View>

      {/* Convocatoria */}
      <ThemedText style={styles.helperText}>
        Convocatoria oficial del evento
      </ThemedText>

      <Button
        mode="outlined"
        icon="ion:cloud-upload-outline"
        onPress={seleccionarDocumento}
        style={styles.uploadButton}
      >
        {documento ? "Cambiar Convocatoria" : "Seleccionar Convocatoria"}
      </Button>

      {documento && (
        <Surface style={styles.documentPreview} elevation={1}>
          <Icon source="ion:document" size={40} color={theme.colors.primary} />
          <View style={styles.documentInfo}>
            <ThemedText style={styles.documentName}>
              {documento.name}
            </ThemedText>
            <ThemedText style={styles.documentSize}>
              {documento.type}
            </ThemedText>
          </View>
          <Icon source="ion:checkmark-circle" size={24} color="#4CAF50" />
        </Surface>
      )}

      {/* Certificado Médico */}
      <ThemedText style={styles.helperText}>
        Certificado médico de los participantes
      </ThemedText>

      <Button
        mode="outlined"
        icon="ion:medkit-outline"
        onPress={seleccionarCertificadoMedico}
        style={styles.uploadButton}
      >
        {certificadoMedicoLocal ? "Cambiar Certificado Médico" : "Seleccionar Certificado Médico"}
      </Button>

      {certificadoMedicoLocal && (
        <Surface style={styles.documentPreview} elevation={1}>
          <Icon source="ion:medkit" size={40} color={theme.colors.primary} />
          <View style={styles.documentInfo}>
            <ThemedText style={styles.documentName}>
              {certificadoMedicoLocal.name}
            </ThemedText>
            <ThemedText style={styles.documentSize}>
              {certificadoMedicoLocal.type}
            </ThemedText>
          </View>
          <Icon source="ion:checkmark-circle" size={24} color="#4CAF50" />
        </Surface>
      )}

      <TextInput
        label="Observaciones (Opcional)"
        mode="outlined"
        value={formData.observaciones}
        onChangeText={(text) => updateFormData("observaciones", text)}
        placeholder="Agrega cualquier información adicional relevante"
      />
    </View>
  );

  const TRANSPORTE_LABELS: Record<string, string> = {
    AEREO: "Transporte Aéreo",
    TERRESTRE: "Transporte Terrestre",
    VEHICULO_PROPIO: "Vehículo Propio",
    MARITIMO: "Transporte Marítimo",
    OTRO: "Otro",
  };

  const [showHtmlPreview, setShowHtmlPreview] = useState(false);

  const renderResumenSection = (
    icon: string,
    title: string,
    children: React.ReactNode
  ) => (
    <Surface
      style={[styles.resumenSection, { backgroundColor: theme.colors.surface }]}
      elevation={1}
    >
      <View style={styles.resumenSectionHeader}>
        <Icon source={icon} size={20} color={theme.colors.primary} />
        <Text
          variant="titleSmall"
          style={{ fontWeight: "600", color: theme.colors.onSurface }}
        >
          {title}
        </Text>
      </View>
      <Divider style={{ marginVertical: 8 }} />
      {children}
    </Surface>
  );

  const ResumenRow = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <View style={styles.resumenRow}>
      <Text
        variant="bodySmall"
        style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}
      >
        {label}
      </Text>
      <Text
        variant="bodySmall"
        style={{ color: theme.colors.onSurface, fontWeight: "500", flex: 2, textAlign: "right" }}
      >
        {value}
      </Text>
    </View>
  );

  const formatResumenDate = (date?: Date | null) => {
    if (!date) return "-";
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStepResumen = () => {
    if (!evento) return null;

    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepTitleContainer}>
          <Icon source="ion:document-text" size={24} color={theme.colors.primary} />
          <ThemedText style={styles.stepTitle}>Resumen de Solicitud</ThemedText>
        </View>

        <ThemedText style={styles.helperText}>
          Revisa los datos antes de enviar. Puedes regresar a cualquier paso para
          editar.
        </ThemedText>

        {/* Logística */}
        {renderResumenSection("ion:calendar-outline", "Fechas y Transporte", (
          <>
            <ResumenRow label="Salida" value={formatResumenDate(formData.fechaSalida)} />
            <ResumenRow label="Retorno" value={formatResumenDate(formData.fechaRetorno)} />
            <ResumenRow label="Lugar salida" value={formData.lugarSalida || "-"} />
            <ResumenRow label="Lugar retorno" value={formData.lugarRetorno || "-"} />
            <ResumenRow label="Transporte salida" value={TRANSPORTE_LABELS[formData.transporteSalida] || formData.transporteSalida || "-"} />
            <ResumenRow label="Transporte retorno" value={TRANSPORTE_LABELS[formData.transporteRetorno] || formData.transporteRetorno || "-"} />
          </>
        ))}

        {/* Objetivos */}
        {renderResumenSection("ion:flag-outline", "Objetivos", (
          <View style={{ gap: 6 }}>
            {formData.objetivos
              .filter((o) => o.trim())
              .map((objetivo, index) => (
                <View key={index} style={styles.resumenListItem}>
                  <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: "700", minWidth: 20 }}>
                    {index + 1}.
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurface, flex: 1 }}>
                    {objetivo}
                  </Text>
                </View>
              ))}
          </View>
        ))}

        {/* Criterios */}
        {renderResumenSection("ion:checkmark-done", "Criterios de Selección", (
          <View style={{ gap: 6 }}>
            {formData.criterios
              .filter((c) => c.trim())
              .map((criterio, index) => (
                <View key={index} style={styles.resumenListItem}>
                  <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: "700", minWidth: 20 }}>
                    {index + 1}.
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurface, flex: 1 }}>
                    {criterio}
                  </Text>
                </View>
              ))}
          </View>
        ))}

        {/* Participantes */}
        {renderResumenSection("ion:people-outline", "Participantes", (
          <>
            <View style={styles.resumenParticipantRow}>
              <View style={[styles.resumenParticipantBox, { backgroundColor: theme.colors.primaryContainer }]}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: theme.colors.primary }}>
                  {deportistasSeleccionados.length}
                </Text>
                <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>
                  Deportistas
                </Text>
              </View>
              <View style={[styles.resumenParticipantBox, { backgroundColor: theme.colors.secondaryContainer }]}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: theme.colors.secondary }}>
                  {entrenadoresSeleccionados.length}
                </Text>
                <Text variant="labelSmall" style={{ color: theme.colors.onSecondaryContainer }}>
                  Entrenadores
                </Text>
              </View>
            </View>
            {deportistasSeleccionados.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>
                  Deportistas:
                </Text>
                <View style={styles.chipsContainer}>
                  {deportistasSeleccionados.map((d) => (
                    <Chip key={d.id} compact style={{ marginBottom: 2 }}>
                      {d.nombres} {d.apellidos}
                    </Chip>
                  ))}
                </View>
              </View>
            )}
            {entrenadoresSeleccionados.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>
                  Entrenadores:
                </Text>
                <View style={styles.chipsContainer}>
                  {entrenadoresSeleccionados.map((e) => (
                    <Chip key={e.id} compact style={{ marginBottom: 2 }}>
                      {e.nombres} {e.apellidos}
                    </Chip>
                  ))}
                </View>
              </View>
            )}
          </>
        ))}

        {/* Observaciones */}
        {formData.observaciones?.trim() && (
          renderResumenSection("ion:chatbox-outline", "Observaciones", (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
              {formData.observaciones}
            </Text>
          ))
        )}

        {/* Botón ver preview HTML */}
        <Button
          mode="outlined"
          icon="ion:eye-outline"
          onPress={() => setShowHtmlPreview(true)}
          style={{ borderRadius: 8, marginTop: 4 }}
        >
          Ver vista previa del documento
        </Button>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemedView style={styles.container}>
        {eventoQuery.isLoading || isDraftLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text variant="bodyLarge" style={{ marginTop: 16 }}>
              {isDraftLoading ? "Cargando borrador..." : "Cargando información del evento..."}
            </Text>
          </View>
        ) : eventoQuery.isError ? (
          <View style={styles.loadingContainer}>
            <Icon
              source="ion:alert-circle"
              size={48}
              color={theme.colors.error}
            />
            <Text
              variant="bodyLarge"
              style={{ marginTop: 16, color: theme.colors.error }}
            >
              Error al cargar el evento
            </Text>
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {renderStepIndicator()}

              {/* Renderizar paso actual */}
              {step === 1 && renderStepDocumento()}
              
              {step === 2 && renderStepFechas()}
              {step === 3 && renderStepObjetivos()}
              {step === 4 && renderStepCriterios()}
              {step === 5 && renderStepParticipantes()}
              {step === 6 && renderStepResumen()}
            </ScrollView>

            {/* Modal de preview HTML */}
            <Modal
              visible={showHtmlPreview}
              animationType="slide"
              presentationStyle="pageSheet"
              onRequestClose={() => setShowHtmlPreview(false)}
            >
              <View style={[styles.previewModalContainer, { backgroundColor: theme.colors.background }]}>
                <View style={[styles.previewModalHeader, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.surfaceVariant }]}>
                  <Text variant="titleMedium" style={{ fontWeight: "600", color: theme.colors.onSurface }}>
                    Vista Previa del Documento
                  </Text>
                  <TouchableOpacity onPress={() => setShowHtmlPreview(false)}>
                    <Icon source="ion:close" size={24} color={theme.colors.onSurface} />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  {evento && (
                    <SolicitudPreviewHtml
                      evento={evento}
                      formData={formData}
                      deportistas={deportistasSeleccionados}
                      entrenadores={entrenadoresSeleccionados}
                    />
                  )}
                </View>
              </View>
            </Modal>

            {/* Footer con botones */}

            {/* Footer con botones */}
            {/* Ocultar footer en paso 1 porque se maneja en el sheet */}
            {step > 1 && (
            <View style={styles.footerButtons}>
              {step > 1 && (
                <Button
                  mode="outlined"
                  onPress={handleBack}
                  icon="ion:arrow-back-outline"
                  style={styles.backButtonFooter}
                >
                  Atrás
                </Button>
              )}

              {step < totalSteps ? (
                <Button
                  mode="contained"
                  onPress={handleNext}
                  disabled={
                    !canContinue ||
                    (step === 5 && !participantesValidacion.completo) ||
                    isUploading
                  }
                  loading={isUploading}
                  icon={step === 1 ? "ion:cloud-upload-outline" : "ion:arrow-forward-outline"}
                  contentStyle={styles.nextButtonContent}
                  style={styles.nextButton}
                >
                  {isUploading ? "Subiendo..." : "Continuar"}
                </Button>
              ) : (
                <Button
                  mode="contained"
                  onPress={onSubmit}
                  disabled={solicitudMutation.isPending}
                  loading={solicitudMutation.isPending}
                  icon="send"
                  style={styles.nextButton}
                >
                  {solicitudMutation.isPending
                    ? "Enviando..."
                    : "Enviar Solicitud"}
                </Button>
              )}
            </View>
            )}


            {/* Modal para agregar participantes */}
            {modalState.visible &&
              modalState.tipo &&
              modalState.sexo &&
              evento &&
              (() => {
                const { tipo, sexo } = modalState;
                const participantesYaAgregados =
                  tipo === "atleta"
                    ? deportistasSeleccionados.filter((p) => p.sexo === sexo)
                    : entrenadoresSeleccionados.filter((p) => p.sexo === sexo);

                // Calcular cantidad requerida según tipo y sexo
                let cantidadRequerida = 0;
                if (tipo === "atleta" && sexo === "masculino") {
                  cantidadRequerida = evento.numAtletasHombres;
                } else if (tipo === "atleta" && sexo === "femenino") {
                  cantidadRequerida = evento.numAtletasMujeres;
                } else if (tipo === "entrenador" && sexo === "masculino") {
                  cantidadRequerida = evento.numEntrenadoresHombres;
                } else if (tipo === "entrenador" && sexo === "femenino") {
                  cantidadRequerida = evento.numEntrenadoresMujeres;
                }

                return (
                  <AgregarParticipanteModal
                    visible={modalState.visible}
                    onDismiss={cerrarModal}
                    tipo={tipo}
                    sexo={sexo}
                    cantidadRequerida={cantidadRequerida}
                    cantidadActual={participantesYaAgregados.length}
                    participantesYaAgregados={participantesYaAgregados}
                    onAgregar={
                      tipo === "atleta"
                        ? agregarDeportistas
                        : agregarEntrenadores
                    }
                  />
                );
              })()}

              
          </>
        )}
      </ThemedView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  stepIndicator: {
    marginBottom: 24,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stepText: {
    fontSize: 14,
    fontWeight: "600",
  },
  stepPercentage: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  stepContainer: {
    gap: 16,
  },
  stepTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  helperText: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },

  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
    marginBottom: 8,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    marginTop: 8,
  },
  addButton: {
    alignSelf: "flex-start",
  },
  participantSection: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  participantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participantTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  participantCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  genderButton: {
    flex: 1,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
  selectButton: {
    borderRadius: 8,
  },
  uploadButton: {
    borderRadius: 8,
    paddingVertical: 8,
  },
  documentPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "600",
  },
  documentSize: {
    fontSize: 12,
    opacity: 0.7,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  footerButtons: {
    flexDirection: "row",
    gap: 12,
    margin: 20,
  },
  backButtonFooter: {
    flex: 1,
    borderRadius: 8,
  },
  nextButton: {
    flex: 1,
    borderRadius: 8,
  },
  nextButtonContent: {
    flexDirection: "row-reverse",
  },
  infoBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 20,
    flexDirection: "row",
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  // Bottom Sheet Styles
  sheetContent: {
      padding: 24,
      flex: 1,
  },
  sheetHeader: {
      alignItems: 'center',
      marginBottom: 16,
      gap: 8,
  },
  sheetTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      marginTop: 8,
  },
  sheetDesc: {
      textAlign: 'center',
      marginBottom: 24,
  },
  sheetUploadBtn: {
      marginBottom: 16,
      borderColor: '#E0E0E0', 
      borderStyle: 'dashed',
  },
  filePreviewItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      backgroundColor: '#F5F5F5',
      gap: 12,
      marginBottom: 24,
  },
  sheetActions: {
      gap: 12,
      marginTop: 'auto',
      marginBottom: 24,
  },
  sheetMainBtn: {
      borderRadius: 8,
      paddingVertical: 6,
  },
  // Resumen Styles
  resumenSection: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 4,
  },
  resumenSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  resumenRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  resumenListItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  resumenParticipantRow: {
    flexDirection: "row",
    gap: 10,
  },
  resumenParticipantBox: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    gap: 2,
  },
  // Preview Modal Styles
  previewModalContainer: {
    flex: 1,
  },
  previewModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  // Empty State Styles
  emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      gap: 12,
      minHeight: 300,
      marginTop: 20,
  },
  emptyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 8,
  },
  emptyDesc: {
      textAlign: 'center',
      color: '#666',
  },
});
