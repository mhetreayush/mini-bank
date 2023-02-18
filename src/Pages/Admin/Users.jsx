import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { UserDetails } from "../../Context/UserContext";
import UserTable from "../../Components/UserTable";
import { style } from "../../Components/modalStyle";

const generateAccNo = () => {
  let result = "";
  const digits = "0123456789";

  for (let i = 0; i < 16; i++) {
    result += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  return result;
};

const Users = () => {
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [randomAccNo, setRandomAccNo] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = UserDetails();
  const { accNo: userAccNo, email: userEmail } = user;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const name = data.get("name");
    const email = data.get("email");
    const accNo = randomAccNo;
    const balance = parseFloat(data.get("balance"));
    if (!email || !name || !balance) {
      return;
    }
    await setDoc(doc(db, "users", email), {
      email,
      accNo,
      balance,
      name,
      role: "user",
      transactions: [
        {
          amount: balance,
          type: "credit",
          sender: {
            name: "Admin",
            accNo: userAccNo,
            email: userEmail,
          },
        },
      ],
    });

    setRandomAccNo(generateAccNo());
    setTriggerUpdate((prev) => !prev);
    setOpen(false);
  };
  useEffect(() => {
    setRandomAccNo(generateAccNo());
  }, []);
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div>
      <UserTable
        triggerUpdate={triggerUpdate}
        setTriggerUpdate={setTriggerUpdate}
      />
      <div>
        <Button onClick={() => setOpen(true)}>
          <h1 className=" button primary">Add User</h1>
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box component="form" onSubmit={handleSubmit} sx={style}>
            <Box className="flex flex-col gap-y-3">
              <TextField
                name="name"
                required
                id="name"
                label="Name"
                autoFocus
              />

              <TextField
                required
                id="email"
                type="email"
                label="Email Address"
                name="email"
              />
              <TextField
                required
                name="balance"
                label="Balance"
                id="balance"
                type="number"
              />
              <TextField
                required
                name="accNo"
                label="Account Number (Auto generated)"
                id="accNo"
                disabled
                value={randomAccNo}
              />
            </Box>
            <Box className="flex justify-between" sx={{ mt: 4 }}>
              <button className="button primary" type="submit">
                Add User
              </button>

              <button onClick={handleCancel} className="button red">
                Cancel
              </button>
            </Box>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Users;
