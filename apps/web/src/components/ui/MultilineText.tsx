import { Fragment } from 'react';

type Props = {
  children: string;
  className?: string;
};

const MultilineText = ({ children, className }: Props) => {
  const message = children.split('\n').map((str, idx, array) => {
    return (
      <Fragment key={idx}>
        {str}
        {idx === array.length - 1 ? null : <br />}
      </Fragment>
    );
  });
  return <div className={className}>{message}</div>;
};

export default MultilineText;
