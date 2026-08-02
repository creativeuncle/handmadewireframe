import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import PropertiesPanel from './components/PropertiesPanel'
import TopBar from './components/TopBar'
import ProjectsPage from './components/ProjectsPage'
import AutoSave from './components/AutoSave'
import { useProjectsStore } from './lib/projectsStore'

function App() {
  const view = useProjectsStore((s) => s.view)

  return (
    <>
      <AutoSave />
      {view === 'projects' ? (
        <ProjectsPage />
      ) : (
        <div className="app">
          <Canvas />
          <TopBar />
          <Sidebar />
          <Toolbar />
          <PropertiesPanel />
        </div>
      )}
    </>
  )
}

export default App
