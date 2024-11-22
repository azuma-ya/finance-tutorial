import useOpenAccount from "@/features/accounts/hooks/use-open-account";

interface Props {
  account: string;
  accountId: string;
}

const AccountColumn = ({ account, accountId }: Props) => {
  const { onOpen } = useOpenAccount();

  const handleClick = () => {
    onOpen(accountId);
  };

  return (
    <div
      onClick={handleClick}
      className="flex cursor-pointer items-center hover:underline"
    >
      {account}
    </div>
  );
};

export default AccountColumn;
