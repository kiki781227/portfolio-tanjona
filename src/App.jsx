import Navbar from './sections/NavBar'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Experiences from './sections/Experiences'
import Contact from './sections/Contact'

const App = () => {
  return (
    <div className='w-full'>
       <Navbar />
       <Hero />
       <About />
       <Projects />
       <Experiences/>
       <Contact/>
    </div>
  )
}

App.propTypes = {}

export default App