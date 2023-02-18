import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import UserSelect from "./UserSelect";

const UserTable = ({ toUpdate, triggerUpdate, setTriggerUpdate }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = [];
        querySnapshot.forEach((doc) => {
          if (doc.data()?.role === "user") {
            users.push(doc.data());
          }
        });
        setUsers(users);
        console.log(users);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, [triggerUpdate]);
  return (
    <div>
      <UserSelect
        users={users}
        setTriggerUpdate={setTriggerUpdate}
        toUpdate={toUpdate}
      />
    </div>
  );
};

export default UserTable;
