import { useState } from "react";
import { useParams } from "react-router-dom";
// import CardBodyOnly from "./CardBodyOnly";
import { Container, Col, Row, Table, Form } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const ListInput = () => {
    const [newItem, setNewItem] = useState(""); // set state for newItem
    const [listItems, setListItems] = useState([]); // set state for list items
    const [searchResults, setSearchResults] = useState([]); // set state for search results

    const params = useParams(); // add useParams to get storeID

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

    const addToList = (item) => {
        console.log(item);
        console.log("hit");

        const existingItem = listItems.find((listItem) => {
            return listItem.id === item.id;
        });
        if (existingItem) {
            alert("Already in your list");
            return;
        }

        // Spread out the listItems array and spread out the items object and add done:false
        // to the items object
        let newList = [
            ...listItems,
            { ...item, done: false, quantity: 1 },
        ].sort((a, b) => {
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

    const increaseQuantity = (index) => {
        const copiedItems = [...listItems];
        copiedItems[index].quantity += 1;
        setListItems(copiedItems);
    };

    const decreaseQuantity = (index) => {
        const copiedItems = [...listItems];
        if (copiedItems[index].quantity > 0) {
            copiedItems[index].quantity -= 1;
            setListItems(copiedItems);
        }
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
                            <tr
                                key={item.id}
                                style={{
                                    textDecoration: item.done
                                        ? "line-through"
                                        : "none",
                                }}
                            >
                                <td>
                                    {searchResults.length === 0 ? (
                                        <Form.Check
                                            style={{
                                                display: "inline",
                                                padding: 10,
                                            }}
                                            onClick={() => {
                                                const copiedItems = [
                                                    ...listItems,
                                                ];
                                                if (copiedItems[index].done) {
                                                    copiedItems[
                                                        index
                                                    ].quantity =
                                                        copiedItems[
                                                            index
                                                        ].preCheckedQuantity;
                                                } else {
                                                    copiedItems[
                                                        index
                                                    ].preCheckedQuantity =
                                                        copiedItems[
                                                            index
                                                        ].quantity;
                                                    copiedItems[
                                                        index
                                                    ].quantity = 0;
                                                }
                                                copiedItems[index].done =
                                                    !copiedItems[index].done;

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
                                        <Container>
                                            <Row>
                                                <Col>
                                                    <button
                                                        onClick={(evt) => {
                                                            evt.preventDefault();
                                                            increaseQuantity(
                                                                index
                                                            );
                                                        }}
                                                    >
                                                        <AddIcon />
                                                    </button>
                                                </Col>
                                                <Col style={{ width: 50 }}>
                                                    {item.quantity}
                                                </Col>
                                                <Col
                                                    style={{ paddingRight: 0 }}
                                                >
                                                    <button
                                                        onClick={(evt) => {
                                                            evt.preventDefault();
                                                            decreaseQuantity(
                                                                index
                                                            );
                                                        }}
                                                    >
                                                        <RemoveIcon />
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Container>
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
