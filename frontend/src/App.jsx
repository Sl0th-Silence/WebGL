import './App.css'
import Header from './components/Header'
import WebGLCanvas from './components/WebGLCanvas'

function App() {

  return (
    <>
      <WebGLCanvas header={Header} />
    </>
  )
}

export default App
