import { getColeccionByEvento } from "@/core/avales/actions/colecciones-actions";
import { Evento } from "@/core/eventos/interfaces/evento";
import { uploadConvocatoria } from "@/core/solicitud/actions/solicitud-actions";
import { EmptyState } from "@/presentation/theme/components/EmptyState";
import { toast } from "@backpackapp-io/react-native-toast";
import {
  default as BottomSheet,
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Button, Icon, Surface, Text, useTheme } from "react-native-paper";
import { EventoCard } from "./EventoCard";
import { EventoRechazoBottomSheet } from "./EventoRechazoBottomSheet";

interface EventoListProps {
  eventos: Evento[];
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  onRefresh?: () => Promise<void>;
  emptyStateProps?: {
    icon?: string;
    title: string;
    description?: string;
  };
  filterKey?: string;
  isLoadingMore?: boolean;
}

export const EventoList = ({
  eventos,
  onEndReached,
  onEndReachedThreshold = 0.5,
  emptyStateProps,
  filterKey = "default",
  isLoadingMore = false,
}: EventoListProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [eventoRechazado, setEventoRechazado] = useState<Evento | null>(null);
  const rechazoSheetRef = useRef<BottomSheet>(null);
  
  // Upload Logic State
  const uploadSheetRef = useRef<BottomSheetModal>(null);
  const [selectedEventoForUpload, setSelectedEventoForUpload] = useState<Evento | null>(null);
  const [documento, setDocumento] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const snapPoints = useMemo(() => ["50%", "80%"], []);

  const queryClient = useQueryClient();
  const theme = useTheme();

  const handleEventoPress = async (evento: Evento) => {
    const estadoEvento = evento.estado?.toLowerCase() || "disponible";

    // Rechazado: Mostrar bottom sheet con motivo
    if (estadoEvento === "rechazado") {
      setEventoRechazado(evento);
      rechazoSheetRef.current?.expand();
      return;
    }

    // Solicitado: Navegar a pantalla de resumen
    if (estadoEvento === "solicitado") {
      router.push({
        pathname: "/(protected)/(entrenador)/evento/[id]",
        params: { id: evento.id }
      } as any);
      return;
    }

    // Disponible: Abrir Bottom Sheet para subir convocatoria
    if (estadoEvento === "disponible") {
      setSelectedEventoForUpload(evento);
      setDocumento(null); // Reset documento
      uploadSheetRef.current?.present();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    // Aceptado: Navegar a resumen también
    if (estadoEvento === "aceptado") {
      router.push({
        pathname: "/(protected)/(entrenador)/evento/[id]",
        params: { id: evento.id }
      } as any);
      return;
    }

    // Borrador: Recuperar colección y continuar formulario (Paso 2)
    if (estadoEvento === "borrador") {
        try {
            // Mostrar indicador de carga si es necesario, o toast
            toast.loading("Recuperando borrador...", { id: "loading-draft" });
            const coleccion = await getColeccionByEvento(evento.id);
            toast.dismiss("loading-draft");

            if (coleccion) {
                router.push({
                    pathname: "/(protected)/(entrenador)/solicitud/[eventoId]",
                    params: { 
                        eventoId: evento.id, 
                        initialStep: 2, 
                        coleccionId: coleccion.id 
                    }
                } as any);
            } else {
                toast.error("No se pudo recuperar el borrador");
            }
        } catch (error) {
            toast.dismiss("loading-draft");
            console.error("Error fetching draft collection:", error);
            toast.error("Error al abir el borrador");
        }
        return;
    }
  };

  const onPullToRefresh = async () => {
    setIsRefreshing(true);

    await new Promise((resolve) => setTimeout(resolve, 200));

    await queryClient.invalidateQueries({
      queryKey: ["eventos", "infinite"],
    });

    setIsRefreshing(false);
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

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
      }
    } catch (error) {
      console.error("Error al seleccionar documento:", error);
      toast.error("No se pudo seleccionar el documento");
    }
  };

  const handleUpload = async (continueToForm: boolean) => {
      if (!documento || !selectedEventoForUpload) {
          toast.error("Debes seleccionar un documento");
          return;
      }

      try {
          setIsUploading(true);
          const result = await uploadConvocatoria(Number(selectedEventoForUpload.id), documento);
          toast.success("Convocatoria subida exitosamente");
          
          uploadSheetRef.current?.dismiss();
          
          if (continueToForm) {
              router.push({
                  pathname: "/solicitud/[eventoId]",
                  params: { 
                      eventoId: selectedEventoForUpload.id, 
                      initialStep: 2, 
                      coleccionId: result.coleccionAvalId 
                  }
              });
          }

      } catch (error: any) {
          console.error("Error uploading:", error);
          
          // Si el error es "El evento ya tiene un aval creado", recuperamos la colección y avanzamos
          if (error.message && error.message.includes("ya tiene un aval creado")) {
              try {
                  const existingColeccion = await getColeccionByEvento(Number(selectedEventoForUpload.id));
                  if (existingColeccion) {
                      toast.success("Documento ya subido. Continuando...");
                      uploadSheetRef.current?.dismiss();
                      
                      if (continueToForm) {
                          router.push({
                              pathname: "/(protected)/(entrenador)/solicitud/[eventoId]",
                              params: { 
                                  eventoId: selectedEventoForUpload.id, 
                                  initialStep: 2, 
                                  coleccionId: existingColeccion.id 
                              }
                          } as any);
                      }
                      return;
                  }
              } catch (retryError) {
                  console.error("Error recuperando coleccion existente:", retryError);
              }
          }

          toast.error(error.message || "Error al subir el documento");
      } finally {
          setIsUploading(false);
      }
  };

  const renderUploadSheet = () => (
      <BottomSheetView style={styles.sheetContent}>
          <Text variant="titleLarge" style={[styles.sheetTitle, { color: theme.colors.onSurface }]}>
              {selectedEventoForUpload?.nombre || "Iniciar Solicitud"}
          </Text>
          <Text variant="bodyMedium" style={[styles.sheetDesc, { color: theme.colors.onSurfaceVariant }]}>
              Sube la convocatoria oficial para iniciar el trámite.
          </Text>

          <Button
            mode="outlined"
            icon="ion:cloud-upload-outline"
            onPress={seleccionarDocumento}
            style={styles.uploadButton}
            contentStyle={{ height: 48 }}
          >
            {documento ? "Cambiar Documento" : "Seleccionar Convocatoria"}
          </Button>

          {documento && (
            <Surface style={[styles.filePreview, { backgroundColor: theme.colors.elevation.level1 }]} elevation={0}>
              <Icon source="ion:document" size={24} color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={{ fontWeight: '500', color: theme.colors.onSurface }}>{documento.name}</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{(documento.uri.length/1024).toFixed(2)} KB</Text>
              </View>
              <Icon source="ion:checkmark-circle" size={20} color={theme.colors.primary} />
            </Surface>
          )}

          <View style={styles.sheetActions}>
            <Button 
                mode="contained" 
                onPress={() => handleUpload(true)}
                disabled={!documento || isUploading}
                loading={isUploading}
                style={styles.actionButton}
            >
                Subir y Llenar Formulario
            </Button>
            <Button 
                mode="text" 
                onPress={() => handleUpload(false)}
                disabled={!documento || isUploading}
                style={styles.actionButton}
            >
                Subir y Llenar Después
            </Button>
          </View>
      </BottomSheetView>
  );

  const renderEmptyComponent = () => (
    <EmptyState
      icon={emptyStateProps?.icon || "ion:calendar-outline"}
      title={emptyStateProps?.title || "No hay eventos"}
      description={
        emptyStateProps?.description ||
        "No se encontraron eventos disponibles en este momento"
      }
    />
  );

  return (
    <>
      <FlatList
        key={filterKey} // Fuerza reset del FlatList cuando cambia el filtro
        data={eventos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventoCard evento={item} onPress={() => handleEventoPress(item)} />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          eventos.length === 0
            ? { flex: 1, justifyContent: "center" }
            : { padding: 16, paddingBottom: 100 }
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onPullToRefresh}
          />
        }
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : null
        }
      />

      <EventoRechazoBottomSheet
        ref={rechazoSheetRef}
        evento={eventoRechazado}
      />

      <BottomSheetModal
        ref={uploadSheetRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: theme.colors.elevation.level2 }}
        onDismiss={() => {
            setSelectedEventoForUpload(null);
            setDocumento(null);
        }}
      >
        {renderUploadSheet()}
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    padding: 24,
    gap: 16,
    flex: 1,
  },
  sheetTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sheetDesc: {
    textAlign: 'center',
    marginBottom: 8,
  },
  uploadButton: {
    borderColor: '#E0E0E0', 
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
    marginTop: 8,
  },
  sheetActions: {
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    borderRadius: 8,
  }
});

