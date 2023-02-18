import { useState } from "react";
import FuzzySearch from "fuzzy-search";
import Loader from "./Loader";
import CreditDebitModal from "./CreditDebitModal";
const UserSelect = ({ users, setTriggerUpdate, toUpdate }) => {
  const [searchValue, setSearchValue] = useState("");
  const searcher = new FuzzySearch(users, ["name", "accNo", "email"], {
    caseSensitive: false,
    sort: true,
  });
  var result = [
    ...searcher.search(searchValue),
    ...users.filter(
      (item) =>
        searchValue.toLowerCase().includes(item.name.toLowerCase()) ||
        searchValue.toLowerCase().includes(item.accNo.toLowerCase()) ||
        searchValue.toLowerCase().includes(item.email.toLowerCase())
    ),
  ];
  result = [...new Set(result)];
  const SearchResult = ({ result }) => {
    return result.length > 0 ? (
      <>
        {toUpdate && <i>Click an user to update balance.</i>}
        <div className="flex w-full  overflow-x-auto">
          <table className="w-full">
            <tr className="tableMainRow">
              <td className="cell">Name</td>
              <td className="cell">Acc No.</td>
              <td className="cell">Email</td>
              <td className="cell">Balance</td>
            </tr>
            {result.map((item, idx) => {
              return (
                <CreditDebitModal
                  key={idx}
                  {...item}
                  setTriggerUpdate={setTriggerUpdate}
                  toUpdate={toUpdate}
                />
              );
            })}
          </table>
        </div>
      </>
    ) : (
      <div className="flex w-full items-center justify-center">
        <h1 className="text-2xl font-semibold">No User Found</h1>
      </div>
    );
  };
  return (
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
  );
};

export default UserSelect;
