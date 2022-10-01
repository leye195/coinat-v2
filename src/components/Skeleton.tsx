import { keyframes } from '@emotion/react';
import type { CSSProperties } from 'react';

type Props = {
  fadeDuration?: number;
  startColor?: string;
  endColor?: string;
} & CSSProperties;

const fade = (startColor?: string, endColor?: string) => keyframes`
    from {
        border-color: ${startColor ?? '#EDF2F7'} ;
        background-color:  ${startColor ?? '#EDF2F7'} ;
    }
    to {
        border-color: ${endColor ?? '#A0AEC0'} ;
        background-color:  ${endColor ?? '#A0AEC0'} ;
    }
`;

const Skeleton = (props: Props) => {
  return (
    <div
      style={{
        ...props,
        backgroundClip: 'padding-box',
        backgroundColor: props.backgroundColor ?? 'transparent',
        opacity: props.opacity ?? 0.7,
      }}
      css={{
        animation: `${fade(props.startColor, props.endColor)} ${
          props.fadeDuration ?? 0.8
        }s infinite alternate`,
      }}
    />
  );
};

export default Skeleton;
