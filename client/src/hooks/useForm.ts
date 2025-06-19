import { useState, useCallback } from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any, formData?: any) => boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

interface FormState<T> {
  values: T;
  errors: ValidationErrors;
  touched: { [key: string]: boolean };
  isSubmitting: boolean;
}

export function useForm<T extends { [key: string]: any }>(initialValues: T, validationRules?: { [key: string]: ValidationRules }) {
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  const validateField = useCallback((name: string, value: any) => {
    if (!validationRules || !validationRules[name]) return '';

    const rules = validationRules[name];
    if (rules.required && !value) return 'This field is required';
    if (rules.minLength && value.length < rules.minLength) 
      return `Minimum length is ${rules.minLength} characters`;
    if (rules.maxLength && value.length > rules.maxLength) 
      return `Maximum length is ${rules.maxLength} characters`;
    if (rules.pattern && !rules.pattern.test(value)) 
      return 'Invalid format';
    if (rules.custom && !rules.custom(value, formState.values)) 
      return 'Invalid value';

    return '';
  }, [validationRules, formState.values]);

  const handleChange = useCallback((name: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      errors: { ...prev.errors, [name]: validateField(name, value) },
      touched: { ...prev.touched, [name]: true },
    }));
  }, [validateField]);

  const handleBlur = useCallback((name: string) => {
    setFormState(prev => ({
      ...prev,
      touched: { ...prev.touched, [name]: true },
      errors: { ...prev.errors, [name]: validateField(name, prev.values[name]) },
    }));
  }, [validateField]);

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void>) => {
    setFormState(prev => ({ ...prev, isSubmitting: true }));

    // Validate all fields
    const errors: ValidationErrors = {};
    Object.keys(formState.values).forEach(key => {
      const error = validateField(key, formState.values[key]);
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({
        ...prev,
        errors,
        touched: Object.keys(prev.values).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        isSubmitting: false,
      }));
      return;
    }

    try {
      await onSubmit(formState.values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formState.values, validateField]);

  const reset = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
    });
  }, [initialValues]);

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isSubmitting: formState.isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
} 