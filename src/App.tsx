import "./App.css";
import { useFunctions, useStateStore } from "./state";

function App() {
  const state = useStateStore();
  const functions = useFunctions();

  return <main>{JSON.stringify(state, null, 2)}</main>;
}

export default App;
