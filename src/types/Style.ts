export type Spacing = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

export type Flex = {
  display?: 'flex' | 'inline-flex';
  direction?: 'row' | 'column' | 'column-reverse' | 'row-reverse';
  alignItems?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'start'
    | 'end'
    | 'revert'
    | 'baseline'
    | 'inherit';
  justifyContents?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-around'
    | 'space-between'
    | 'space-evenly'
    | 'start'
    | 'end';
};
