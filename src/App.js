import { getAuth } from "firebase/auth";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import NavWrapper from "./Components/NavWrapper";
import { app } from "./firebase";
import SignIn from "./Pages/Signin";
import SignUp from "./Pages/Signup";
import UserHome from "./Pages/User/Home";
import Transfer from "./Pages/User/Transfer";
import Transactions from "./Pages/User/Transactions";
import AdminHome from "./Pages/Admin/Home";
import Users from "./Pages/Admin/Users";
import CreditDebit from "./Pages/Admin/CreditDebit";
import { UserDetails } from "./Context/UserContext";
import { ToastContainer } from "react-toastify";
const auth = getAuth(app);
const App = () => {
  const { user, isLoggedIn } = UserDetails();
  const role = user?.role;

  return (
    <>
      <BrowserRouter>
        {!isLoggedIn && (
          <>
            <Routes>
              <Route path="/signin" element={<SignIn auth={auth} />} />
              <Route path="/signup" element={<SignUp auth={auth} />} />
              <Route path="*" element={<SignIn auth={auth} />} />
            </Routes>
          </>
        )}

        {isLoggedIn && (
          <NavWrapper role={role}>
            <Routes>
              {role === "user" && (
                <>
                  <Route path="/user/transfer" element={<Transfer />} />
                  <Route path="/user/home" element={<UserHome />} />
                  <Route path="/user/transactions" element={<Transactions />} />
                  <Route path="*" element={<SignIn auth={auth} />} />
                </>
              )}
              {role === "admin" && (
                <>
                  <Route path="/admin/home" element={<AdminHome />} />
                  <Route path="/admin/users" element={<Users />} />
                  <Route path="/admin/credit-debit" element={<CreditDebit />} />
                  <Route path="*" element={<SignIn auth={auth} />} />
                </>
              )}
            </Routes>
          </NavWrapper>
        )}
        <ToastContainer />
      </BrowserRouter>
    </>
  );
};

export default App;
