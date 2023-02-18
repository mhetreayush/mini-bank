import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import FuzzySearch from "fuzzy-search";
import { useEffect, useState } from "react";
import Loader from "../../Components/Loader";
import { db } from "../../firebase";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
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
const generateAccNo = () => {
  let result = "";
  const digits = "0123456789";

  for (let i = 0; i < 16; i++) {
    result += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  return result;
};
const SearchResult = ({ result }) => {
  return result.length > 0 ? (
    <>
      <div className="tableMain">
        <div className="tableBody grid-cols-3 ">
          <th>Name</th>
          <th>Account Number</th>
          <th>Balance</th>
        </div>
        <div className="flex flex-col w-full  divide-y divide-black divide">
          {result.map((item, idx) => {
            return (
              <div className="tableCell grid-cols-3 " key={idx}>
                <h1>{item.name}</h1>
                <h1>{item.accNo}</h1>
                <h1>{item.balance}</h1>
              </div>
            );
          })}
        </div>
      </div>
    </>
  ) : (
    <div className="flex w-full items-center justify-center">
      <h1 className="text-2xl font-semibold">No Users</h1>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    balance: 0,
    accNo: generateAccNo(),
    role: "user",
  });
  const getUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = [];
    querySnapshot.forEach((doc) => {
      if (doc.data()?.role === "user") {
        users.push(doc.data());
      }
    });
    setUsers(users);
  };

  const searcher = new FuzzySearch(users, ["name"], {
    caseSensitive: false,
    sort: true,
  });
  var result = [
    ...searcher.search(searchValue),
    ...users.filter((item) =>
      searchValue.toLowerCase().includes(item.name.toLowerCase())
    ),
  ];
  result = [...new Set(result)];
  const addNewUser = async () => {
    await setDoc(doc(db, "users", newUser.email), {
      ...newUser,
    });
    // console.log(newUser);
    getUsers();
    setNewUser({
      ...newUser,
      email: "",
      name: "",
      accNo: generateAccNo(),
    });
    setOpen(false);
  };
  useEffect(() => {
    getUsers();
  }, []);
  const handleCancel = () => {
    setNewUser({
      ...newUser,
      email: "",
      name: "",
    });
    setOpen(false);
  };
  return (
    <div>
      <div>
        <main className="flex flex-col justify-between max-h-screen pb-3 gap-y-5">
          <form>
            <input
              placeholder="Search User"
              type="text"
              className="w-full p-2 rounded-md border-2 border-gray-300"
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>
          <div className="flex flex-col flex-grow gap-y-4  rounded-md overflow-y-auto ">
            {users.length === 0 ? (
              Array.from({ length: 3 }).map((_, idx) => {
                return <Loader key={idx} userButton />;
              })
            ) : (
              <SearchResult result={result} />
            )}
          </div>
        </main>
      </div>
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
          <Box sx={style}>
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  return;
                }}
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Name
                </Typography>
                <input
                  required
                  type="text"
                  value={newUser.name}
                  placeholder="Name"
                  className="inputTextClass"
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />

                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Email
                </Typography>
                <input
                  required
                  type="email"
                  value={newUser.email}
                  placeholder="Email"
                  className="inputTextClass"
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />

                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Balance
                </Typography>
                <input
                  required
                  type="number"
                  value={newUser.balance}
                  placeholder="Balance"
                  className="inputTextClass"
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      balance: parseFloat(e.target.value),
                    })
                  }
                />

                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Account Number:
                </Typography>
                <input
                  disabled
                  value={newUser.accNo}
                  className="inputTextClass"
                />
              </form>
              <div className="flex gap-x-5 my-3">
                <button onClick={addNewUser} className="button primary">
                  Submit
                </button>
                <button onClick={handleCancel} className="button red">
                  Cancel
                </button>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Users;
