import { useEffect, useState } from "react";

const idb =
  window.indexedDB ||
  window.webkitIndexedDB ||
  window.mozIndexedDB ||
  window.msIndexedDB;

const createCollectionIndexedDB = () => {
  if (!idb) {
    console.log("The browser doesn't support indexedDB");
    return;
  }

  const request = idb.open("my-store", 2);

  request.onerror = (e) => {
    console.log("Error", e);
    console.log("The error occured with indexedDB");
  };

  request.onupgradeneeded = () => {
    const db = request.result;

    if (!db.objectStoreNames.contains("myUserData")) {
      db.createObjectStore("myUserData", {
        keyPath: "id",
      });
    }
  };

  request.onsuccess = () => {
    console.log("Database opened successfully.");
  };
};

const Container = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [allUsersData, setAllUsersData] = useState([]);

  useEffect(() => {
    createCollectionIndexedDB();
    getAllUsersData();
  }, []);

  const getAllUsersData = () => {
    const dbPromise = idb.open("my-store", 2);

    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("myUserData", "readonly");

      const usersData = tx.objectStore("myUserData");
      const users = usersData.getAll();

      users.onsuccess = (query) => {
        setAllUsersData(query.srcElement.result);
      };
      users.onerror = () => {
        console.log("Error occured while getting users data");
      };

      tx.oncomplete = () => {
        db.close();
      };
    };
  };

  const handleAddUserClicked = (e) => {
    e.preventDefault();
    console.log("Clicked Add button");

    const dbPromise = idb.open("my-store", 2);
    if (firstName && lastName && email) {
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        const tx = db.transaction("myUserData", "readwrite");
        const userData = tx.objectStore("myUserData");

        const user = userData.put({
          id: allUsersData?.length + 1,
          firstName,
          lastName,
          email,
        });

        user.onsuccess = () => {
          tx.oncomplete = () => {
            db.close();
          };

          getAllUsersData();
          alert("User Added successfully.");
        };

        user.onerror = () => {
          console.log("Error occured with adding user");
        };
      };
    }
  };
  return (
    <div className="w-full h-[84vh]">
      <div className="lg:w-7xl sm:w-full mx-auto px-4 py-8">
        <div className="row flex flex-wrap justify-center">
          <div className="lg:w-[50%] w-full px-4">
            <div className="w-full text-right">
              <button
                onClick={() => console.log("Add Btn click")}
                className="text-md font-bold text-white bg-blue-700 py-2 px-4 rounded-md hover:bg-amber-600 cursor-pointer transition-all duration-700"
              >
                + ADD
              </button>
            </div>
            <div className="w-full bg-white border border-gray-300 px-4 py-1 rounded-sm mt-4">
              <div className="flex border-b border-b-gray-300">
                <span className="w-[23%] p-2 text-sm font-bold">Firstname</span>
                <span className="w-[23%] p-2 text-sm font-bold">Lastname</span>
                <span className="w-[32%] p-2 text-sm font-bold">Email</span>
                <span className="w-[22%] p-2 text-sm font-bold text-center">
                  Actions
                </span>
              </div>
              {allUsersData.map((row) => (
                <div key={row?.id} className="flex border-b border-b-gray-300 nth-last-of-type-[1]:border-none">
                  <span className="w-[23%] p-2 text-sm">{row?.firstName}</span>
                  <span className="w-[23%] p-2 text-sm">{row?.lastName}</span>
                  <span className="w-[32%] p-2 text-sm">{row?.email}</span>
                  <span className="w-[22%] p-2 text-sm flex gap-1 justify-center">
                    <button
                      onClick={() => console.log("Click edit user")}
                      className="bg-green-700 text-white py-1 px-2 cursor-pointer rounded-sm text-[12px]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => console.log("Click delete user")}
                      className="bg-red-700 text-white py-1 px-2 cursor-pointer rounded-sm text-[12px]"
                    >
                      Delete
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-[50%] w-full px-4">
            <div className="w-full bg-white border border-gray-300 px-4 py-1 rounded-sm">
              <h2 className="text-xl border-b border-b-gray-300 pb-2 pt-1 font-bold">
                Add User
              </h2>
              <div className="flex flex-col py-2">
                <label className="text-sm font-bold mb-1">First Name</label>
                <input
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-9 rounded-sm border border-gray-300 px-4 text-sm"
                  placeholder="First Name"
                />
              </div>
              <div className="flex flex-col py-2">
                <label className="text-sm font-bold mb-1">Last Name</label>
                <input
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-9 rounded-sm border border-gray-300 px-4 text-sm"
                  placeholder="Last Name"
                />
              </div>
              <div className="flex flex-col py-2">
                <label className="text-sm font-bold mb-1">Email</label>
                <input
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-9 rounded-sm border border-gray-300 px-4 text-sm"
                  placeholder="Email"
                />
              </div>
              <div className="w-full py-2 mb-2">
                <button
                  onClick={handleAddUserClicked}
                  className="text-sm font-bold text-white bg-blue-700 py-2 px-4 rounded-md hover:bg-amber-600 cursor-pointer transition-all duration-700"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Container;
