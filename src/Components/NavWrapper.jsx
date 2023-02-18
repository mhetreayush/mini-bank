import { Link, useNavigate } from "react-router-dom";
import { UserDetails } from "../Context/UserContext";

const NavWrapper = ({ children, role }) => {
  const { setIsLoggedIn } = UserDetails();
  const navigate = useNavigate();
  const roles = {
    user: [
      {
        name: "Home",
        path: "/user/home",
      },
      {
        name: "Transactions",
        path: "/user/transactions",
      },
      {
        name: "Transfer",
        path: "/user/transfer",
      },
    ],
    admin: [
      {
        name: "Home",
        path: "/admin/home",
      },
      {
        name: "Users",
        path: "/admin/users",
      },
      {
        name: "Credit Debit",
        path: "/admin/credit-debit",
      },
    ],
  };

  const logout = () => {
    setIsLoggedIn(false);
    navigate("/signin");
  };
  return (
    <div className="grid grid-cols-12 min-h-screen ">
      <div className="col-span-2 p-2 sticky top-0">
        <div className="flex  flex-col justify-between items-center bg-gray-200 rounded-md p-2 h-full">
          <div>
            <h1 className="text-2xl font-semibold">Task</h1>
          </div>
          <div className="w-full h-full justify-center flex-col gap-y-4 flex">
            {roles[role].map((item, idx) => {
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className="w-full button primary text-center"
                >
                  <h1>{item.name}</h1>
                </Link>
              );
            })}
          </div>
          <div className="justify-self-end p-2 w-full">
            <button onClick={logout} className="button red w-full">
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-10 px-10 py-2">{children}</div>
    </div>
  );
};

export default NavWrapper;
