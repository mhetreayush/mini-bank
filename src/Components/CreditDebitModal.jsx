import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { TextField } from "@mui/material";
import { db } from "../firebase";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { toast } from "react-toastify";
import { UserDetails } from "../Context/UserContext";
import { style } from "./modalStyle";

const CreditDebitModal = ({
  name,
  email,
  balance,
  accNo,
  setTriggerUpdate,
  toUpdate,
}) => {
  const [updateAmount, setUpdateAmount] = useState(null);
  const [action, setAction] = useState("credit");
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = UserDetails();
  const { email: userEmail, accNo: userAccNo } = user;
  useEffect(() => {
    if (action === "credit") {
      setShowAlert(false);
    }
    if (action === "debit") {
      if (balance - updateAmount < 0) {
        setShowAlert(true);
        return;
      }
      setShowAlert(false);
    }
  }, [action, updateAmount, balance]);

  const handleUpdate = async () => {
    if (!updateAmount || updateAmount === 0) {
      return;
    }
    if (updateAmount < 0) {
      toast.error("Amount cannot be negative");
      return;
    }
    try {
      if (showAlert) {
        return;
      }
      const docRef = doc(db, "users", email);
      if (action === "credit") {
        const amount = balance + parseFloat(updateAmount);
        await updateDoc(docRef, {
          balance: amount,
          transactions: arrayUnion({
            amount: parseFloat(updateAmount),
            sent: false,
            sender: {
              name: "Admin",
              email: userEmail,
              accNo: userAccNo,
            },
          }),
        });
      }
      if (action === "debit") {
        const amount = balance - parseFloat(updateAmount);
        await updateDoc(docRef, {
          balance: amount,
          transactions: arrayUnion({
            amount: parseFloat(updateAmount),
            sent: true,
            receiver: {
              name: "Admin",
              email: userEmail,
              accNo: userAccNo,
            },
          }),
        });
      }
      toast.success("Updated Successfully");
      setTriggerUpdate((prev) => !prev);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setOpen(false);
    }
    console.log("updateAmount", balance, updateAmount, action);
  };
  const handleCancel = () => {
    setTimeout(() => {
      setOpen(false);
    }, 10);
  };
  return (
    <tr
      onClick={() => setOpen(true)}
      className={`${toUpdate && "cursor-pointer"} text-left tableRow`}
    >
      <td className="tableCell">{name}</td>
      <td className="tableCell">{accNo}</td>
      <td className="tableCell">{email}</td>
      <td className="tableCell">{balance}</td>
      {toUpdate && (
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {email}
              <br />
              Balance: {balance}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  <h1 className="text-primaryGray">Action:</h1>
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  defaultValue="credit"
                  onChange={(e) => setAction(e.target.value)}
                >
                  <FormControlLabel
                    value="credit"
                    control={<Radio />}
                    label="Credit"
                  />
                  <FormControlLabel
                    value="debit"
                    control={<Radio />}
                    label="Debit"
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                onChange={(e) => setUpdateAmount(e.target.value)}
                label="Amount"
                variant="outlined"
                className="w-full"
                type="number"
              />
            </Typography>
            {showAlert && (
              <div className="text-red-500">Insufficient Balance</div>
            )}
            <Box className="flex w-full justify-between my-3">
              <button
                onClick={handleUpdate}
                disabled={showAlert || !updateAmount}
                className="button primary disabled:bg-gray-200 disabled:cursor-not-allowed transition-all duration-100 ease-in"
              >
                Update
              </button>
              <button onClick={handleCancel} className="button red">
                Cancel
              </button>
            </Box>
          </Box>
        </Modal>
      )}
    </tr>
  );
};

export default CreditDebitModal;
