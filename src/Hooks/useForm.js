import { useState } from 'react';

const useForm = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const validate = (value) => {
    if (!value.length) {
      setError('Por favor, preencha o formulário.');
      return false;
    } else {
      setError('');
      return true;
    }
  };

  const onChange = ({ target }) => {
    validate(target.value);
    setValue(target.value);
  };

  return {
    value,
    onChange,
    error,
    validate: () => validate(value),
    onBlur: () => validate(value),
  };
};

export default useForm;
