import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import PropertiesPanel from './components/PropertiesPanel'

function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="canvas-area">
        <Canvas />
        <Toolbar />
      </main>
      <PropertiesPanel />
    </div>
  )
}

export default App
