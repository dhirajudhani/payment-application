import { BrowserRouter, Route, Routes } from "react-router-dom"
function App() {


  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={s}></Route>
            <Route path="/signin" element={s}></Route>
            <Route path="/dashboard" element={s}></Route>
            <Route path="/send" element={s}></Route>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
