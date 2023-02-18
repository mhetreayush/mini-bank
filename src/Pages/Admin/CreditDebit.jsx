import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import UserSelect from "../../Components/UserSelect";

const CreditDebit = () => {
  const [users, setUsers] = useState([]);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
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
      <UserSelect users={users} setTriggerUpdate={setTriggerUpdate} />
    </div>
  );
};

export default CreditDebit;
