import { Route, Routes } from "react-router-dom"
import Main from "./pages/Main"
import Result from "./pages/Result"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />}></Route>
      <Route path="/result" element={<Result />}></Route>
    </Routes>
  )
}

export default App
