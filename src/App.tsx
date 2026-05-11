import Editor from './components/Editor'
import Toolbar from './components/Toolbar'
import LayersPanel from './components/LayersPanel'
import PropertiesPanel from './components/PropertiesPanel'

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Toolbar />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <LayersPanel />
        </div>
        
        <Editor />
        
        <div className="w-72 bg-white border-l border-gray-200 flex-shrink-0">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  )
}

export default App