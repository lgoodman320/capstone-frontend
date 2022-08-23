import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Home"
import List from './List';
import ListInput from './ListInput';

function App() {
  return (
    <div className="App container">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/list' element={<List />} />
        <Route path='listInput' element={<ListInput />} />
      </Routes>
    </BrowserRouter>
      
    </div>
  );
}

export default App;
