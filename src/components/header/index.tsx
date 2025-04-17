import {BiLogOut} from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../services/firebaseConnection'

export function Header(){
    
    async function handleLogOut(){
        await signOut(auth)
    }
    
    return(
        <header className='w-full max-w-2xl mt-4 px-1 text-black'>
            <nav className='w-full bg-white   h-12 flex items-center justify-between rounded-md px-3'>
                <div className='flex gap-4 font-medium'>
                    <Link to="/">Home</Link>
                    <Link to="/admin">Links</Link>
                    <Link to="/admin/social">redes sociais</Link>
                </div>

                <button onClick={handleLogOut}>
                    <BiLogOut size={28} color="#db2629" />
                </button>
            </nav>
        </header>
    )
}