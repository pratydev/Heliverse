import { useState } from 'react'
import PrincipalDashboard from './PrincipalDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import SignIn from './SignIn';
import './App.css'

function App() {
  const [login, setLogin] = useState<boolean>(false);
  const [role, setRole] = useState<string>('Student');

  return (
    

    !login ? <SignIn  role={role} setRole={setRole} setLogin={setLogin}  /> : role === 'Principal' ? <PrincipalDashboard setLogin={setLogin} /> : role === 'Teacher' ? <TeacherDashboard setLogin={setLogin} /> : <StudentDashboard setLogin={setLogin} />
    // <>
    // <PrincipalDashboard/>
    // </>
    
  )
}

export default App
