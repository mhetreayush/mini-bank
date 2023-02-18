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
import { updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CreditDebitModal = ({
  name,
  email,
  balance,
  accNo,
  setTriggerUpdate,
}) => {
  const [updateAmount, setUpdateAmount] = useState(0);
  const [action, setAction] = useState("credit");
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false);

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
        });
      }
      if (action === "debit") {
        const amount = balance - parseFloat(updateAmount);
        await updateDoc(docRef, {
          balance: amount,
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
  return (
    <div className="tableCell">
      <button
        className=" w-full  grid grid-cols-4 text-left"
        onClick={() => setOpen(true)}
      >
        <div>{name}</div>
        <div>{accNo}</div>
        <div>{email}</div>
        <div>{balance}</div>
      </button>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={() => setOpen(false)}
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
            />
          </Typography>
          {showAlert && (
            <div className="text-red-500">Insufficient Balance</div>
          )}
          <Box className="flex w-full justify-between my-3">
            <button
              onClick={handleUpdate}
              disabled={showAlert}
              className="button primary disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              Update
            </button>
            <button onClick={() => setOpen(false)}>
              <h1 className="button red">Cancel</h1>
            </button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default CreditDebitModal;
