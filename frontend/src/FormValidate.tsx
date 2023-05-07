import { useState } from 'preact/hooks';

const useForm = (initialState :any, validate :any) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event : Event) => {
    const { name, value } = event.target as HTMLInputElement | HTMLSelectElement;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (event : Event) => {
    event.preventDefault();
    setErrors(validate(values));
    setIsSubmitting(true);
  };

  return { values, errors, handleChange, handleSubmit, isSubmitting };
};

export default useForm;
