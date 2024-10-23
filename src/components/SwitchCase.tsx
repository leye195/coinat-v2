type Case = string | number;

type Props = {
  value: Case;
  caseBy: Partial<Record<Case, JSX.Element | null>>;
  defaultComponent?: JSX.Element | null;
};

const SwitchCase = ({ value, caseBy, defaultComponent = null }: Props) => {
  if (value == null) return defaultComponent;

  return caseBy[value] ?? defaultComponent;
};

export default SwitchCase;
