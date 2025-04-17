import { FormEvent, useEffect, useState } from "react";
import { Header } from "../../components/header";
import { Input } from "../../components/input";
import { FiTrash } from "react-icons/fi";
import { db } from "../../services/firebaseConnection";

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Links } from "react-router-dom";

interface LinkProps {
  id: string;
  name: string;
  url: string;
  bg: string;
  color: string;
}

export function Admin() {
  const [nameInput, SetNameInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [textColorInput, setTextColorInput] = useState("#f1f1f1");
  const [backgroundColorInput, setBackgroudColorInput] = useState("#121212");

  const [links, setLinks] = useState<LinkProps[]>([]);

  useEffect(() => {
    const linksref = collection(db, "links");
    const queryref = query(linksref, orderBy("created", "asc"));

    const unsub = onSnapshot(queryref, (snapshot) => {
      let lista = [] as LinkProps[];
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          bg: doc.data().bg,
          color: doc.data().color,
        });
      });

      setLinks(lista);
    });

    return () => {
      unsub();
    };
  }, []);

  function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (nameInput === "" || urlInput === "") {
      alert("preencha todos os campos");
      return;
    }

    addDoc(collection(db, "links"), {
      name: nameInput,
      url: urlInput,
      bg: backgroundColorInput,
      color: textColorInput,
      created: new Date(),
    })
      .then(() => {
        SetNameInput("");
        setUrlInput("");
      })
      .catch((error) => {
        console.log("ERRO AO CADASTRAR" + error);
      });
  }

  async function handleDeleteLink(id: string){
    const docref =doc(db, "links", id)
    await deleteDoc(docref)
  }

  return (
    <>
      <div className="flex items-center  flex-col min-h-screen pb-7 px-2 text-white">
        <Header />

        <form
          className="flex flex-col mt-8 mb-3 w-full max-w-xl"
          onSubmit={handleRegister}
        >
          <label htmlFor="" className="font-medium mt-2 mb-2">
            Nome do Link
          </label>
          <Input
            placeholder="digite o nome do link..."
            value={nameInput}
            onChange={(e) => SetNameInput(e.target.value)}
          />

          <label htmlFor="" className="font-medium mt-2 mb-2">
            Url do Link
          </label>
          <Input
            type="url"
            placeholder="digite a url..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />

          <section className="flex my-4 gap-5">
            <div className="flex gap-2">
              <label htmlFor="" className="font-medium mt-2 mb-2">
                Cor do Link
              </label>
              <input
                type="color"
                value={textColorInput}
                onChange={(e) => setTextColorInput(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <label htmlFor="" className="font-medium mt-2 mb-2">
                Fundo do Link
              </label>
              <input
                type="color"
                value={backgroundColorInput}
                onChange={(e) => setBackgroudColorInput(e.target.value)}
              />
            </div>
          </section>

          {nameInput !== "" && (
            <div className="flex items-center justify-center flex-col mb-7 p-1 border-gray-100/25 border rounded-md">
              <label htmlFor="" className="font-medium mt-2 mb-3">
                Veja como está ficando
              </label>
              <article
                className="w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-3"
                style={{
                  marginBottom: 8,
                  marginTop: 8,
                  backgroundColor: backgroundColorInput,
                }}
              >
                <p className="font-medium" style={{ color: textColorInput }}>
                  {nameInput}
                </p>
              </article>
            </div>
          )}

          <button
            type="submit"
            className="mb-7  bg-blue-600 h-9 rounded-md text-white font-medium gap-4 flex justify-center items-center"
          >
            Cadastrar
          </button>
        </form>

        <h2 className="font-bold text-white mb-4 text-2xl">Meus links</h2>

        {links.map((link) => (
          <article
            key={link.id}
            style={{ backgroundColor: link.bg, color: link.color }}
            className="flex items-center font-bold justify-between w-11/12 max-w-xl rounded py-3 px-2 mb-2 select-none"
          >
            <p>{link.name}</p>
            <div>
              <button className="border border-dashed p-1 rounded"
              onClick={()=> handleDeleteLink(link.id)}
              >
                <FiTrash size={18} color="#fff" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
