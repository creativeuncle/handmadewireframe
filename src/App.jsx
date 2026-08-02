import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import PropertiesPanel from './components/PropertiesPanel'

function App() {
  return (
    <div className="app">
      <Canvas />
      <Sidebar />
      <Toolbar />
      <PropertiesPanel />
    </div>
  )
}

export default App
