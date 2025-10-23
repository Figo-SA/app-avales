/**
 * EJEMPLOS DE USO DEL SISTEMA DE MANEJO DE ERRORES
 * 
 * Este archivo contiene ejemplos de cómo usar el sistema de manejo de errores
 * en diferentes escenarios comunes.
 */

import { toast } from "@backpackapp-io/react-native-toast";
import { updateUserProfile } from "@/core/profile/actions/profile-actions";
import { authLogin } from "@/core/auth/actions/auth-action";
import { isErrorType, getErrorField, handleApiError } from "./error-handler";

// ============================================================================
// EJEMPLO 1: Uso Básico en Pantallas
// ============================================================================

export const ejemploUsoBasico = async (data: any) => {
  try {
    const result = await updateUserProfile(data);
    toast.success("Perfil actualizado correctamente");
    return result;
  } catch (error: any) {
    // El error ya viene procesado por handleApiError en la action
    toast.error(error.message);
  }
};

// ============================================================================
// EJEMPLO 2: Manejo de Errores Específicos
// ============================================================================

export const ejemploErrorEspecifico = async (data: any) => {
  try {
    const result = await updateUserProfile(data);
    return result;
  } catch (error: any) {
    // Verificar si es un error de cédula duplicada
    if (isErrorType(error, "DUPLICATE_CEDULA")) {
      toast.error("Esta cédula ya está en uso. Usa otra diferente");
      // Puedes ejecutar lógica específica aquí
      return null;
    }

    // Para otros errores, mostrar mensaje general
    toast.error(error.message);
    return null;
  }
};

// ============================================================================
// EJEMPLO 3: Obtener Campo del Error (para validaciones de formulario)
// ============================================================================

export const ejemploErrorCampo = async (data: any, setFieldError: any) => {
  try {
    const result = await updateUserProfile(data);
    return result;
  } catch (error: any) {
    // Obtener el campo que causó el error
    const field = getErrorField(error);
    
    if (field) {
      // Marcar el campo específico con error en el formulario
      setFieldError(field, error.message);
    } else {
      // Error general
      toast.error(error.message);
    }
  }
};

// ============================================================================
// EJEMPLO 4: Login con Manejo de Múltiples Errores
// ============================================================================

export const ejemploLogin = async (
  email: string,
  password: string,
  setEmailError: any,
  setPasswordError: any
) => {
  try {
    const result = await authLogin(email, password);
    toast.success("Bienvenido");
    return result;
  } catch (error: any) {
    // Diferentes acciones según el tipo de error
    if (isErrorType(error, "INVALID_CREDENTIALS")) {
      setEmailError("Usuario o contraseña incorrectos");
      setPasswordError("Usuario o contraseña incorrectos");
    } else if (isErrorType(error, "UNAUTHORIZED")) {
      toast.error("Tu cuenta ha sido desactivada");
    } else {
      toast.error(error.message);
    }
    return null;
  }
};

// ============================================================================
// EJEMPLO 5: Retry con Manejo de Errores
// ============================================================================

export const ejemploRetry = async (data: any, maxRetries = 3) => {
  let attempts = 0;
  
  while (attempts < maxRetries) {
    try {
      const result = await updateUserProfile(data);
      toast.success("Operación exitosa");
      return result;
    } catch (error: any) {
      attempts++;
      
      // Si es error de red, reintentar
      if (error.message.includes("conexión") && attempts < maxRetries) {
        console.log(`Reintentando... (${attempts}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        continue;
      }
      
      // Si no es error de red o ya se acabaron los reintentos
      toast.error(error.message);
      throw error;
    }
  }
};

// ============================================================================
// EJEMPLO 6: Validación Previa con Manejo de Errores
// ============================================================================

export const ejemploValidacionPrevia = async (
  data: any,
  validate: () => boolean
) => {
  // Validación del lado del cliente
  if (!validate()) {
    toast.error("Por favor completa todos los campos requeridos");
    return null;
  }
  
  try {
    const result = await updateUserProfile(data);
    toast.success("Datos guardados correctamente");
    return result;
  } catch (error: any) {
    // Manejo de errores del servidor
    if (isErrorType(error, "VALIDATION_ERROR")) {
      toast.error("Hay errores en el formulario. Verifica los datos");
    } else {
      toast.error(error.message);
    }
    return null;
  }
};

// ============================================================================
// EJEMPLO 7: Agregar Logging Personalizado
// ============================================================================

export const ejemploLoggingPersonalizado = async (data: any) => {
  try {
    const result = await updateUserProfile(data);
    return result;
  } catch (error: any) {
    // El handleApiError ya hace logging automático
    // Pero puedes agregar analytics o tracking adicional
    
    if (isErrorType(error, "DUPLICATE_CEDULA")) {
      // Enviar evento a analytics
      // analytics.track('duplicate_cedula_error', { userId: data.id });
    }
    
    toast.error(error.message);
    throw error;
  }
};

// ============================================================================
// EJEMPLO 8: Manejo en React Hook Form
// ============================================================================

export const ejemploReactHookForm = async (
  data: any,
  setError: any
) => {
  try {
    const result = await updateUserProfile(data);
    toast.success("Perfil actualizado");
    return result;
  } catch (error: any) {
    const field = getErrorField(error);
    
    if (field) {
      // Setear error en el campo específico
      setError(field, {
        type: "manual",
        message: error.message,
      });
    } else {
      // Error general del formulario
      setError("root", {
        type: "manual",
        message: error.message,
      });
      toast.error(error.message);
    }
  }
};

// ============================================================================
// EJEMPLO 9: Manejo con Estados de Loading
// ============================================================================

export const ejemploConLoading = async (
  data: any,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) => {
  setLoading(true);
  setError(null);
  
  try {
    const result = await updateUserProfile(data);
    toast.success("Operación exitosa");
    return result;
  } catch (error: any) {
    setError(error.message);
    toast.error(error.message);
    return null;
  } finally {
    setLoading(false);
  }
};

// ============================================================================
// EJEMPLO 10: Manejo con Confirmación de Usuario
// ============================================================================

export const ejemploConConfirmacion = async (
  data: any,
  showConfirm: (message: string) => Promise<boolean>
) => {
  try {
    const result = await updateUserProfile(data);
    toast.success("Cambios guardados");
    return result;
  } catch (error: any) {
    // Si es un error específico, pedir confirmación
    if (isErrorType(error, "DUPLICATE_CEDULA")) {
      const confirmed = await showConfirm(
        "Esta cédula ya existe. ¿Deseas verificar los datos?"
      );
      
      if (confirmed) {
        // Redirigir a verificación o abrir modal
        // router.push('/verificar-cedula');
      }
    } else {
      toast.error(error.message);
    }
    return null;
  }
};
