import { useState } from "react";
import UserTable from "../../Components/UserTable";

const CreditDebit = () => {
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  return (
    <UserTable
      toUpdate
      triggerUpdate={triggerUpdate}
      setTriggerUpdate={setTriggerUpdate}
    />
  );
};

export default CreditDebit;
