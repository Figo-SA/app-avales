import {
  solicitudCompletaSchema,
  type SolicitudCompletaData,
} from "@/validations/solicitud-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { uploadConvocatoria } from "@/core/solicitud/actions/solicitud-actions";
import {
  useSolicitudDraftStore,
  type SolicitudDraft,
} from "@/presentation/solicitud/store/useSolicitudDraftStore";
import { toast } from "@backpackapp-io/react-native-toast";

const DEFAULT_VALUES: SolicitudCompletaData = {
  fechaSalida: undefined as any,
  fechaRetorno: undefined as any,
  lugarSalida: "",
  lugarRetorno: "",
  transporteSalida: "",
  transporteRetorno: "",
  objetivos: ["", ""],
  criterios: ["", ""],
  deportistas: [],
  entrenadores: [],
  documento: null,
  certificadoMedico: null,
  coleccionAvalId: undefined,
  observaciones: "",
};

export const useSolicitud = (eventoId: string, initialStep: number = 1, existingColeccionId?: number) => {
  // Si ya hay coleccionId existente, saltar paso 1 (documentos ya subidos)
  const [step, setStep] = useState(existingColeccionId ? Math.max(initialStep, 2) : initialStep);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraftLoading, setIsDraftLoading] = useState(true);
  const totalSteps = 6;
  const draftLoaded = useRef(false);
  const prevEventoId = useRef(eventoId);

  const { saveDraft, loadDraft } = useSolicitudDraftStore();

  // React Hook Form con validación de Zod
  const {
    control,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid },
    trigger,
  } = useForm<SolicitudCompletaData>({
    resolver: zodResolver(solicitudCompletaSchema),
    mode: "onChange",
    defaultValues: {
      ...DEFAULT_VALUES,
      coleccionAvalId: existingColeccionId,
    },
  });

  // Resetear formulario cuando cambia el eventoId
  useEffect(() => {
    if (prevEventoId.current !== eventoId) {
      prevEventoId.current = eventoId;
      draftLoaded.current = false;
      reset({ ...DEFAULT_VALUES, coleccionAvalId: existingColeccionId });
      setStep(existingColeccionId ? Math.max(initialStep, 2) : initialStep);
      setIsDraftLoading(true);
    }
  }, [eventoId]);

  // Watch para acceder a los valores actuales del formulario
  const formData = watch();

  // Construir draft serializable desde los valores actuales del form
  const buildDraft = (currentStep: number): SolicitudDraft => {
    const values = getValues();
    return {
      step: currentStep,
      coleccionAvalId: values.coleccionAvalId,
      fechaSalida: values.fechaSalida?.toISOString(),
      fechaRetorno: values.fechaRetorno?.toISOString(),
      lugarSalida: values.lugarSalida,
      lugarRetorno: values.lugarRetorno,
      transporteSalida: values.transporteSalida,
      transporteRetorno: values.transporteRetorno,
      objetivos: values.objetivos,
      criterios: values.criterios,
      deportistas: values.deportistas,
      entrenadores: values.entrenadores,
      observaciones: values.observaciones || "",
    };
  };

  // Cargar draft al inicializar
  useEffect(() => {
    if (draftLoaded.current) return;
    draftLoaded.current = true;

    const restoreDraft = async () => {
      try {
        const draft = await loadDraft(eventoId);
        if (!draft) return;

        // Restaurar campos serializables
        if (draft.fechaSalida) setValue("fechaSalida", new Date(draft.fechaSalida));
        if (draft.fechaRetorno) setValue("fechaRetorno", new Date(draft.fechaRetorno));
        if (draft.lugarSalida) setValue("lugarSalida", draft.lugarSalida);
        if (draft.lugarRetorno) setValue("lugarRetorno", draft.lugarRetorno);
        if (draft.transporteSalida) setValue("transporteSalida", draft.transporteSalida);
        if (draft.transporteRetorno) setValue("transporteRetorno", draft.transporteRetorno);
        if (draft.objetivos?.length) setValue("objetivos", draft.objetivos);
        if (draft.criterios?.length) setValue("criterios", draft.criterios);
        if (draft.deportistas?.length) setValue("deportistas", draft.deportistas);
        if (draft.entrenadores?.length) setValue("entrenadores", draft.entrenadores);
        if (draft.observaciones) setValue("observaciones", draft.observaciones);
        if (draft.coleccionAvalId) setValue("coleccionAvalId", draft.coleccionAvalId);

        // Si ya se subieron documentos, ir mínimo a paso 2
        if (draft.coleccionAvalId) {
          const restoredStep = Math.max(draft.step || 2, 2);
          setStep(Math.min(restoredStep, totalSteps));
        }
      } finally {
        setIsDraftLoading(false);
      }
    };

    restoreDraft();
  }, [eventoId]);

  // Actualizar un campo del formulario usando setValue de React Hook Form
  const updateFormData = (field: keyof SolicitudCompletaData, value: any) => {
    setValue(field, value, { shouldValidate: true });
  };

  // Actualizar un item de un array (objetivos o criterios)
  const updateArrayItem = (
    array: "objetivos" | "criterios",
    index: number,
    value: string
  ) => {
    const currentArray = formData[array];
    const newArray = currentArray.map((item, i) =>
      i === index ? value : item
    );
    setValue(array, newArray, { shouldValidate: true });
  };

  // Agregar un nuevo item a un array (objetivos o criterios)
  const addArrayItem = (array: "objetivos" | "criterios") => {
    const currentArray = formData[array];
    setValue(array, [...currentArray, ""], { shouldValidate: true });
  };

  // Agregar deportista
  const addDeportista = (deportista: any) => {
    setValue("deportistas", [...formData.deportistas, deportista], {
      shouldValidate: true,
    });
  };

  // Remover deportista
  const removeDeportista = (index: number) => {
    const newDeportistas = formData.deportistas.filter((_, i) => i !== index);
    setValue("deportistas", newDeportistas, { shouldValidate: true });
  };

  // Agregar entrenador
  const addEntrenador = (entrenador: any) => {
    setValue("entrenadores", [...formData.entrenadores, entrenador], {
      shouldValidate: true,
    });
  };

  // Remover entrenador
  const removeEntrenador = (index: number) => {
    const newEntrenadores = formData.entrenadores.filter((_, i) => i !== index);
    setValue("entrenadores", newEntrenadores, { shouldValidate: true });
  };

  // Validar si se puede continuar al siguiente paso
  const getCanContinue = () => {
    switch (step) {
      case 1:
        return formData.documento !== null && formData.certificadoMedico !== null && !errors.documento && !errors.certificadoMedico;
      case 2:
        return (
          formData.fechaSalida &&
          formData.fechaRetorno &&
          formData.lugarSalida &&
          formData.lugarRetorno &&
          formData.transporteSalida &&
          formData.transporteRetorno &&
          !errors.fechaSalida &&
          !errors.fechaRetorno &&
          !errors.lugarSalida &&
          !errors.lugarRetorno &&
          !errors.transporteSalida &&
          !errors.transporteRetorno
        );
      case 3:
        return (
          formData.objetivos.filter((obj) => obj.trim()).length >= 2 &&
          !errors.objetivos
        );
      case 4:
        return (
          formData.criterios.filter((crit) => crit.trim()).length >= 2 &&
          !errors.criterios
        );
      case 5:
        return (
          formData.deportistas.length > 0 &&
          formData.entrenadores.length > 0 &&
          !errors.deportistas &&
          !errors.entrenadores
        );
      case 6:
        // Paso de resumen, siempre se puede enviar
        return true;
      default:
        return false;
    }
  };

  const canContinue = getCanContinue();

  // Avanzar al siguiente paso (con validación)
  const handleNext = async () => {
    let fieldsToValidate: (keyof SolicitudCompletaData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["documento", "certificadoMedico"];
        break;
      case 2:
        fieldsToValidate = [
          "fechaSalida",
          "fechaRetorno",
          "lugarSalida",
          "lugarRetorno",
          "transporteSalida",
          "transporteRetorno",
        ];
        break;
      case 3:
        fieldsToValidate = ["objetivos"];
        break;
      case 4:
        fieldsToValidate = ["criterios"];
        break;
      case 5:
        fieldsToValidate = ["deportistas", "entrenadores"];
        break;
      case 6:
        // Paso de resumen, no necesita validación adicional
        break;
    }

    // Validar solo los campos del paso actual
    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid && step < totalSteps) {
      // Si estamos en el paso 1, subir la convocatoria
      if (step === 1) {
        // Verificar si ya se subió (por si el usuario retrocedió)
        if (formData.coleccionAvalId) {
          const nextStep = step + 1;
          setStep(nextStep);
          saveDraft(eventoId, buildDraft(nextStep));
          return;
        }

        try {
          setIsUploading(true);
          const result = await uploadConvocatoria(Number(eventoId), formData.documento, formData.certificadoMedico);
          setValue("coleccionAvalId", result.coleccionAvalId);
          toast.success("Convocatoria subida correctamente");
          const nextStep = step + 1;
          setStep(nextStep);
          // Guardar draft con coleccionAvalId recién obtenido
          saveDraft(eventoId, {
            ...buildDraft(nextStep),
            coleccionAvalId: result.coleccionAvalId,
          });
        } catch (error) {
          console.error("Error al subir convocatoria:", error);
          toast.error(
             error instanceof Error ? error.message : "Error al subir la convocatoria"
          );
        } finally {
          setIsUploading(false);
        }
      } else {
        const nextStep = step + 1;
        setStep(nextStep);
        saveDraft(eventoId, buildDraft(nextStep));
      }
    }
  };

  // Retroceder al paso anterior
  // Si ya se subieron documentos (coleccionAvalId), no volver a paso 1
  const handleBack = () => {
    const minStep = formData.coleccionAvalId ? 2 : 1;
    if (step > minStep) {
      const prevStep = step - 1;
      setStep(prevStep);
      saveDraft(eventoId, buildDraft(prevStep));
    } else {
      router.back();
    }
  };

  return {
    // Estado
    step,
    totalSteps,
    formData,
    errors,
    isUploading,
    isDraftLoading,

    // React Hook Form
    control,
    setValue,

    // Acciones de navegación
    handleNext,
    handleBack,

    // Acciones de formulario
    updateFormData,
    updateArrayItem,
    addArrayItem,
    addDeportista,
    removeDeportista,
    addEntrenador,
    removeEntrenador,

    // Validación
    canContinue,
  };
};
