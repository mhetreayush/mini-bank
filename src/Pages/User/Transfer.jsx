import { TextField } from "@mui/material";
import { UserDetails } from "../../Context/UserContext";
import { db } from "../../firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { Box } from "@mui/system";
import { useRef } from "react";
const Transfer = () => {
  const { user, setUser } = UserDetails();
  const { email: userEmail, accNo, balance, name } = user;
  const formRef = useRef(null);
  const handleTransfer = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const recipientAccNo = data.get("recipient");
      const amount = parseFloat(data.get("amount"));
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("accNo", "==", recipientAccNo));
      const querySnapshot = await getDocs(q);
      const recipientDoc = querySnapshot.docs[0].data().email;
      console.log(recipientDoc);
      if (recipientAccNo === accNo) {
        toast.error("You cannot transfer to yourself");
        return;
      }
      if (amount > balance) {
        toast.error("Insufficient Balance");
        return;
      }
      await updateDoc(doc(db, "users", recipientDoc), {
        balance: increment(amount),
        transactions: arrayUnion({
          sent: false,
          sender: {
            name: name,
            accNo: accNo,
            email: userEmail,
          },
          amount: amount,
        }),
      });
      await updateDoc(doc(db, "users", userEmail), {
        balance: increment(-amount),
        transactions: arrayUnion({
          sent: true,
          receiver: {
            name: querySnapshot.docs[0].data().name,
            accNo: recipientAccNo,
            email: recipientDoc,
          },
          amount: amount,
        }),
      });
      setUser(
        (prevData) => (prevData = { ...prevData, balance: balance - amount })
      );

      formRef.current.reset();
    } catch (err) {
      toast.error("No user found with this account number");
    }
  };
  const handleCancel = () => {
    toast.success("Transfer Cancelled");
  };
  return (
    <div>
      <h1 className="my-3">Account Details:</h1>

      <div className="flex w-full overflow-x-auto">
        <table className="w-full">
          <tr className="tableMainRow">
            <td className="cell">Name</td>
            <td className="cell">Acc No.</td>
            <td className="cell">Email</td>
            <td className="cell">Balance</td>
          </tr>
          <tr className="tableRow">
            <td className="tableCell">{name}</td>
            <td className="tableCell">{accNo}</td>
            <td className="tableCell">{userEmail}</td>
            <td className="tableCell">{balance}</td>
          </tr>
        </table>
      </div>
      <h1 className="my-3">Transfer To:</h1>
      <Box component="form" onSubmit={handleTransfer} ref={formRef}>
        <Box className="flex flex-col gap-y-3">
          <TextField
            required
            name="recipient"
            label="Recipient Account Number"
            id="recipient"
            fullWidth
          />

          <TextField
            required
            name="amount"
            label="Amount"
            id="amount"
            type="number"
            fullWidth
          />
          <Box className="flex justify-between w-fit gap-x-5" sx={{ mt: 4 }}>
            <button type="submit" className="button primary">
              Transfer
            </button>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <button
              type="reset"
              role="button"
              onClick={handleCancel}
              className="button red"
            >
              Cancel
            </button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Transfer;
