import { useState } from "react";

const ListInput = () => {
    const [newItem, setNewItem] = useState("");
    const [listItems, setListItems] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [itemQuantity, setItemQuantity] = useState("");

    const searchForItems = async (evt) => {
        evt.preventDefault();
        const itemsResponse = await fetch(`http://localhost:3001/itemsSearch`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ searchTerm: newItem }),
        });
        const data = await itemsResponse.json();
        setSearchResults(data.items);
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
        setNewItem("");
        setSearchResults([]);

        let newList = [...listItems, item].sort((a, b) => {
            return a.aisle - b.aisle;
        });
        setListItems(newList);
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
                            {item.name} {item.aisle} {item.fulfillment_store_number} {" "}
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
