import { useRef, useState } from "react";

import Select from "@/components/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useCreateAccount from "@/features/accounts/api/use-create-account";
import useGetAccounts from "@/features/accounts/api/use-get-accounts";

const useSelectAccount = (): [() => JSX.Element, () => Promise<unknown>] => {
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const handleCreateAccount = (name: string) =>
    accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const [promise, setPromise] = useState<{
    resolove: (value: string | undefined) => void;
  } | null>(null);
  const selectValue = useRef<string>();

  const confirm = () =>
    new Promise((resolove, reject) => {
      setPromise({ resolove });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolove(selectValue.current);
    handleClose();
  };

  const handleChancel = () => {
    promise?.resolove(undefined);
    handleClose();
  };

  const ConfirmationDailog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>
          <DialogDescription>
            Please select an accout to continue.
          </DialogDescription>
        </DialogHeader>
        <Select
          placeholder="Select an account"
          options={accountOptions}
          onChange={(value) => (selectValue.current = value)}
          onCreate={handleCreateAccount}
          disabled={accountMutation.isPaused || accountQuery.isLoading}
        />
        <DialogFooter>
          <Button onClick={handleChancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDailog, confirm];
};

export default useSelectAccount;
