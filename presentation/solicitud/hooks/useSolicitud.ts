import {
  solicitudCompletaSchema,
  type SolicitudCompletaData,
} from "@/validations/solicitud-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const useSolicitud = (eventoId: string) => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // React Hook Form con validación de Zod
  const {
    control,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<SolicitudCompletaData>({
    resolver: zodResolver(solicitudCompletaSchema),
    mode: "onChange",
    defaultValues: {
      fechaSalida: undefined,
      fechaRetorno: undefined,
      transporteSalida: "",
      transporteRetorno: "",
      objetivos: ["", ""],
      criterios: ["", ""],
      deportistas: [],
      entrenadores: [],
      documento: null,
      observaciones: "",
    },
  });

  // Watch para acceder a los valores actuales del formulario
  const formData = watch();

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
        return (
          formData.fechaSalida &&
          formData.fechaRetorno &&
          formData.transporteSalida &&
          formData.transporteRetorno &&
          !errors.fechaSalida &&
          !errors.fechaRetorno &&
          !errors.transporteSalida &&
          !errors.transporteRetorno
        );
      case 2:
        return (
          formData.objetivos.filter((obj) => obj.trim()).length >= 2 &&
          !errors.objetivos
        );
      case 3:
        return (
          formData.criterios.filter((crit) => crit.trim()).length >= 2 &&
          !errors.criterios
        );
      case 4:
        return (
          formData.deportistas.length > 0 &&
          formData.entrenadores.length > 0 &&
          !errors.deportistas &&
          !errors.entrenadores
        );
      case 5:
        return formData.documento !== null && !errors.documento;
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
        fieldsToValidate = [
          "fechaSalida",
          "fechaRetorno",
          "transporteSalida",
          "transporteRetorno",
        ];
        break;
      case 2:
        fieldsToValidate = ["objetivos"];
        break;
      case 3:
        fieldsToValidate = ["criterios"];
        break;
      case 4:
        fieldsToValidate = ["deportistas", "entrenadores"];
        break;
      case 5:
        fieldsToValidate = ["documento"];
        break;
    }

    // Validar solo los campos del paso actual
    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid && step < totalSteps) {
      setStep(step + 1);
    }
  };

  // Retroceder al paso anterior
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
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
