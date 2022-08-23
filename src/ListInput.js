import { useState } from "react";

const ListInput = () => {
    const [itemInput, setItemInput] = useState("");
    const [itemQuantity, setItemQuantity] = useState("");

    return (
        <form className="list-form">
            <input type="text" placeholder="Add item" value={itemInput} name='text' className='item-input' />

            <button type="button" class="btn btn-primary item-button">Add item</button>
        </form>
    );
};

export default ListInput;
