import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import APIUrl from "./APIUrl";

const PickStore = () => {
    const params = useParams();
    //create state of empty array to store stores
    const [stores, setStores] = useState([]);
    const navigate = useNavigate();
    console.log(params.ext_id);

    //useEffect to make API call to get list of stores
    //after api call, set  stores state to list
    useEffect(() => {
        const getStores = async () => {
            const repsonse = await fetch(`${APIUrl}/stores`);
            const storeData = await repsonse.json();
            setStores(storeData.stores);
            console.log(storeData);
        };
        getStores();
    }, []);

    const storeChanged = (evt) => {
        navigate(`/listInput/${evt.target.value}`);
    };

    return (
        <div>
            <h1>Pick Store</h1>
            {/*map over state to get access to each store
            //in the return of stores you will add a button that links to your listinput route and includes the id of the store*/}
            <select onChange={storeChanged}>
                {stores.map((store) => {
                    return (
                        <option key={store.id} value={store.ext_id}>
                            {store.name}
                        </option>
                    );
                })}
            </select>
            {/* <div className="dropdown">
                    <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Pick Store
                    </button>
                    <ul className="dropdown-menu">
                        <li key={index} >
                            <Link to="/" className="dropdown-item" href="#">
                                {store.name}
                            </Link>
                        </li>
        
                    </ul>
                </div> */}
        </div>
    );
};

export default PickStore;
