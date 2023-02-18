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
    <div className="lg:grid grid-cols-12 lg:min-h-screen">
      <div className="lg:col-span-2 w-full  p-2 lg:sticky lg:top-0  fixed  bottom-0 z-50 lg:z-0">
        <div className="flex lg:flex-col w-full justify-between items-center bg-gray-200 rounded-md p-2 h-full">
          <div className="hidden lg:block">
            <h1 className="text-2xl font-semibold">Task</h1>
          </div>
          <div className="w-full h-full justify-evenly lg:justify-center lg:flex-col gap-y-4 flex">
            {roles[role].map((item, idx) => {
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className="lg:w-full button primary text-center"
                >
                  <h1>{item.name}</h1>
                </Link>
              );
            })}
          </div>
          <div className="lg:justify-self-end p-2 lg:w-full">
            <button onClick={logout} className="button red w-full">
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-10 p-4 lg:px-10  lg:py-2">{children}</div>
    </div>
  );
};

export default NavWrapper;
