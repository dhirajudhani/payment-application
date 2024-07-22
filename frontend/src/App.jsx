import { BrowserRouter, Route, Routes } from "react-router-dom"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
function App() {


  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<SignUp/>}></Route>
            <Route path="/signin" element={<SignIn/>}></Route>
            {/* <Route path="/dashboard" element={s}></Route>
            <Route path="/send" element={s}></Route> */}
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
