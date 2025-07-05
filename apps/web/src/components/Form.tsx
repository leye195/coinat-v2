import { ComponentProps } from 'react';

const Form = ({ children, ...rest }: ComponentProps<'form'>) => {
  return <form {...rest}>{children}</form>;
};

export default Form;
