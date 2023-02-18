import HomeDataComponent from "../../Components/HomeDataComponent";
import { UserDetails } from "../../Context/UserContext";

const Home = () => {
  const { user } = UserDetails();
  const { accNo, balance, name } = user;
  console.log(user);
  const arr = [
    {
      name: "Account Number",
      value: accNo,
    },
    {
      name: "Name",
      value: name,
    },
    {
      name: "Balance",
      value: balance,
    },
  ];
  return (
    <div>
      <HomeDataComponent arr={arr} />
    </div>
  );
};

export default Home;
