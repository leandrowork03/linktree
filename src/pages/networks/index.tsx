import { FormEvent, useEffect, useState } from "react"
import { Header } from "../../components/header"
import { Input } from "../../components/input"

import {db} from '../../services/firebaseConnection'
import{
    setDoc,
    addDoc,
    getDoc,
    doc,
} from 'firebase/firestore'

export function Networks(){
    const[linkedin, setLikedin] = useState("")
    const[github, setGithub] =useState("")

    useEffect(()=>{

        function loadingLinks(){
            const docRef =doc(db, "social", "link")
            getDoc(docRef)
            .then((snapshot)=>{
                if (snapshot.exists()) {
                    setLikedin(snapshot.data()?.linkedin || "")
                    setGithub(snapshot.data()?.github || "")
                  }
            })

        }

        loadingLinks()
    },[])

    function handleRegister(e: FormEvent){
        e.preventDefault()
        setDoc(doc(db, "social", "link"),{
            linkedin: linkedin,
            github: github,
        })
        .then(()=>{

        })
        .catch(()=>{
            
        })
    }

    return(
        <>
        <div className="flex items-center flex-col min-h-screen pb-7 px-2">
            <Header/>
            <h1 className="text-white text-2xl font-bold mt8 mb-4">Minhas redes sociais</h1>
            <form onSubmit={handleRegister} className="flex flex-col max-w-xl w-full">
            <label className="text-white font-medium mt-2 mb-3">link Linkedin</label>
            <Input
            type="url"
            placeholder="digite a url do Linkedin..."
            value={linkedin}
            onChange={(e)=> setLikedin(e.target.value)}
            />

            <label className="text-white font-medium mt-2 mb-3">link GitHub</label>
            <Input
            type="url"
            placeholder="digite a url do Github..."
            value={github}
            onChange={(e)=> setGithub(e.target.value)}
            />

            <button 
            type="submit"
            className="text-white bg-blue-600 h-9 rouded-md items-center justify-center flex mb-7 font-medium"
            >
            Salvar links
            </button>

            </form>
        </div>
        </>
    )
}