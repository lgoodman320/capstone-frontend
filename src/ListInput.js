import { getAllByLabelText } from "@testing-library/react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
// import CardBodyOnly from "./CardBodyOnly";
import { Card, Container, Col, Row, Table, Tab, Form } from "react-bootstrap";

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
    };

    const itemTypedIn = (evt) => {
        setNewItem(evt.target.value);
    };

    // const handleClick = (evt) => {
    //    const copiedItems = [...listItems];
    //    copiedItems[index].done = true;
    // };

    const addToList = (item) => {
        console.log(item);
        console.log("hit");

        // LEFT OFF TRYING TO ADD STRIKETHROUGH FUNCTIONALITY USING THE HOMEWORK FOR TO DO REACT APP
        // TRYING TO CHANGE THE ITEM TO AN OBJECT AND ADD A 'done: false' TO THE ITEM OBJECT:  [...listItems, {item: item, done: false}]. I GET
        // CANNOT READ PROPERTY OF UNDEFINED (reading 'trim').  I NEED TO CHANGE IT BACK TO  [...listItems, item]

        let newList = [...listItems, { ...item, done: false }].sort((a, b) => {
            try {
                console.log(listItems.item);
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
    const label = searchResults.length > 0 ? "Search Results" : "Sorted List";

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
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Aisle</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {listToUse.map((item, index) => {
                        return (
                            <tr key={item.id} style={{ 
                                textDecoration: item.done
                                ? "line-through" : "none"
                            }}>
                                <td>
                                    {searchResults.length === 0 ? (
                                        <Form.Check
                                            style={{
                                                display: "inline",
                                                padding: 10,
                                            }}
                                            onClick={() => {
                                                const copiedItems = [...listItems];
                                                copiedItems[index].done = !copiedItems[index].done;
                                                setListItems(copiedItems);
                                                console.log(copiedItems);
                                            }}
                                        />
                                    ) : null}
                                    {item.name}
                                </td>
                                <td>{item.aisle.trim()}</td>
                                <td>
                                    {searchResults.length > 0 ? (
                                        <button
                                            onClick={(evt) => {
                                                evt.preventDefault();

                                                addToList(item);
                                            }}
                                        >
                                            Add to List
                                        </button>
                                    ) : (
                                        <div>Add QTY here</div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </form>
    );
};

export default ListInput;
