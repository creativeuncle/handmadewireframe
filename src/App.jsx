import Canvas from './components/Canvas'
import IconRail from './components/IconRail'
import LayersPanel from './components/LayersPanel'
import TopBar from './components/TopBar'
import FloatingTextToolbar from './components/FloatingTextToolbar'
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
          <IconRail />
          <LayersPanel />
          <FloatingTextToolbar />
        </div>
      )}
    </>
  )
}

export default App
