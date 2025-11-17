import { Flex } from '@/components/Flex';
import Text from '@/components/Text';
import { cn } from '@/lib/utils';
import { palette } from '@/styles/variables';

type Props = {
  title: string;
  description?: string;
  className?: string;
};

const ErrorMessage = ({ title, description, className }: Props) => {
  return (
    <Flex
      className={cn(
        'w-full rounded-md border border-gray-200 bg-white p-4',
        className,
      )}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="8px"
    >
      <Text fontWeight={700} fontSize="16px">
        {title}
      </Text>
      {description ? (
        <Text fontSize="14px" color={palette.gray}>
          {description}
        </Text>
      ) : null}
    </Flex>
  );
};

export default ErrorMessage;
