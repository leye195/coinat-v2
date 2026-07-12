import { ComponentProps, forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  (props, ref) => {
    return <input ref={ref} {...props} />;
  },
);

Input.displayName = 'Input';

export default Input;
