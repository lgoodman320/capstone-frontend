import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import List from "./List";
import ListInput from "./ListInput";
import Layout from "./Layout";

function App() {
    return (
        <div className="App container">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/list" element={<List />} />
                    <Route path="/listInput/:ext_id" element={<ListInput />} />
                    {/* Modify above route to include a /:storeID */}
                </Route>
              </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
