import React from 'react';
import Error from '../Helper/Error';
import styles from './Input.module.css';

const Input = ({
  type,
  label,
  id,
  value,
  onChange,
  error,
  onBlur,
  inpuRefLog,
  inputRefReg,
}) => {
  return (
    <div>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={styles.input}
        ref={inpuRefLog || inputRefReg}
      />
      <Error error={error} />
    </div>
  );
};

export default Input;
