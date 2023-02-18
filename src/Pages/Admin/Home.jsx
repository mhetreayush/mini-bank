import { collection, getDocs, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import HomeDataComponent from "../../Components/HomeDataComponent";
import { db } from "../../firebase";

const Home = () => {
  const [data, setData] = useState({
    totalBalance: null,
    totalUsers: null,
  });
  const getData = async () => {
    const getTotalBalance = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      let totalBalance = 0;
      querySnapshot.forEach((doc) => {
        if (doc.data()?.role === "user") {
          totalBalance += doc.data()?.balance;
        }
      });
      return totalBalance;
    };
    const totalBalance = await getTotalBalance();
    const getTotalUsers = async () => {
      // const querySnapshot = await getDocs(
      //   collection(db, "users"),
      //   where("role", "==", "user")
      // );
      // return querySnapshot.size;
      const querySnapshot = await getDocs(collection(db, "users"));
      let totalUsers = 0;
      querySnapshot.forEach((doc) => {
        if (doc.data()?.role === "user") {
          totalUsers++;
        }
      });
      return totalUsers;
    };
    const totalUsers = await getTotalUsers();

    setData({
      totalBalance,
      totalUsers,
    });
  };

  useEffect(() => {
    getData();
  }, []);
  const arr = [
    {
      name: "Total Balance",
      value: data.totalBalance,
    },
    {
      name: "Total Users",
      value: data.totalUsers,
    },
  ];
  return <HomeDataComponent arr={arr} />;
};

export default Home;
