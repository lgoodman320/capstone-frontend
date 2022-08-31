import { getAllByLabelText } from "@testing-library/react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const ListInput = () => {
    const [newItem, setNewItem] = useState("");
    const [listItems, setListItems] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [itemQuantity, setItemQuantity] = useState("");
    // add useParams to get storeID
    const params = useParams();

    const searchForItems = async (evt) => {
        evt.preventDefault();
        const itemsResponse = await fetch(`http://localhost:3001/itemsSearch`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                searchTerm: newItem,
                //include store ID to filter items by store
                ext_id: params.ext_id,
            }),
        });
        const data = await itemsResponse.json();
        let items = data.items.sort((a, b) => {
            try {
                const aNums = a.aisle.match(/\d+/)[0];
                const bNums = b.aisle.match(/\d+/)[0];

                return bNums - aNums;
            } catch (e) {
                return 0;
            }
        });
        setSearchResults(items);
        // const updatedItems = [...items, newItem];
        // setItems(updatedItems);
        // // setNewItem('')
        // console.log(updatedItems);
    };

    const itemTypedIn = (evt) => {
        // if (evt.target.value !== "") {
        setNewItem(evt.target.value);
        // }
    };

    const addToList = (item) => {
        console.log(item);
        console.log("hit");

        let newList = [...listItems, item].sort((a, b) => {
            try {
                console.log(item);
                let aMatch = a.aisle.match(/\d+/);
                let bMatch = b.aisle.match(/\d+/);
                let aNums = 999;
                let bNums = 999;

                if (aMatch) {
                    aNums = parseInt(aMatch[0]);
                }

                if (bMatch) {
                    bNums = parseInt(bMatch[0]);
                }

                console.log(
                    aNums,
                    bNums,
                    a.aisle.trim(),
                    b.aisle.trim(),
                    a.aisle.trim().localeCompare(b.aisle.trim())
                );

                return (
                    aNums - bNums ||
                    a.aisle.trim().localeCompare(b.aisle.trim())
                );
            } catch (e) {
                console.error(e);
                return 0;
            }
        });
        setListItems(newList);
        setNewItem("");
        setSearchResults([]);
    };

    const listToUse = searchResults.length > 0 ? searchResults : listItems;
    const label = searchResults.length > 0 ? "Search Results" : "Current List";

    return (
        <form className="list-form" onSubmit={searchForItems}>
            <button
                onClick={(evt) => {
                    evt.preventDefault();
                    console.log(listItems);
                    setSearchResults([]);
                }}
            >
                View sorted list
            </button>
            <input
                type="text"
                placeholder="Add item"
                value={newItem}
                name="text"
                className="item-input"
                onChange={itemTypedIn}
            />

            <button type="submit" className="item-button">
                Search for items
            </button>
            <h1>{label}</h1>
            <ul>
                {listToUse.map((item, index) => {
                    return (
                        <li key={index} className="list-item">
                            {item.name} {item.aisle}{" "}
                            {item.fulfillment_store_number}{" "}
                            <button
                                onClick={(evt) => {
                                    evt.preventDefault();

                                    addToList(item);
                                }}
                            >
                                Add to List
                            </button>
                        </li>
                    );
                })}
            </ul>
        </form>
    );
};

export default ListInput;
