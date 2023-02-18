import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserDetails } from "../../Context/UserContext";
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const { user } = UserDetails();
  const { email } = user;
  useEffect(() => {
    const fetchTransactions = async () => {
      const userDoc = await getDoc(doc(db, "users", email));
      setTransactions(userDoc.data().transactions);
    };
    fetchTransactions();
  }, []);
  return (
    <div>
      <div>Transactions</div>
      <div className="flex w-full overflow-x-auto">
        <table className="w-full">
          <tr className="tableMainRow">
            <td className="cell">Type</td>
            <td className="cell">Recipient Acc No</td>
            <td className="cell">Recipient Name</td>
            <td className="cell">Amount</td>
          </tr>
          {transactions?.map((transaction, idx) => {
            const { sent, amount, receiver, sender } = transaction;
            return (
              <tr
                className={`tableRow grid-cols-4 ${
                  sent ? "!bg-primaryRed" : "!bg-gray-600 text-white"
                }`}
                key={idx}
              >
                <td className="tableCell">
                  {transaction.sent ? "Sent" : "Received"}
                </td>
                <td className="tableCell">
                  {sent ? receiver.accNo : sender.accNo}
                </td>
                <td className="tableCell">
                  {sent ? receiver.name : sender.name}
                </td>
                <td className="tableCell">{amount}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default Transactions;
