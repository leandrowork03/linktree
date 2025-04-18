import { useEffect, useState } from "react";

import { Header } from "../../components/header";
import { Social } from "../../components/social";

import { FaLinkedin, FaGithub } from "react-icons/fa";
import { db } from "../../services/firebaseConnection";
import {
  getDocs,
  collection,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";

interface LinkProps {
  id: string;
  name: string;
  url: string;
  bg: string;
  color: string;
}

interface SocialLinksProps {
  linkedin: string;
  github: string;
}

export function Home() {
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinksProps>();

  useEffect(() => {
    function loadLinks() {
      const linksref = collection(db, "links");
      const queryref = query(linksref, orderBy("created", "asc"));
      getDocs(queryref).then((snapshot) => {
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
    }
    loadLinks();
  }, []);

  useEffect(() => {
    function loadSocialLinks() {
      const docRef = doc(db, "social", "link");

      getDoc(docRef).then((snapshot) => {
        if (snapshot.exists()) {
          setSocialLinks({
            linkedin: snapshot.data().linkedin,
            github: snapshot.data().github,
          });
        }
      });
    }

    loadSocialLinks();
  }, []);

  return (
    <div className="flex flex-col w-full py-4 items-center justify-center">
      <Header />
      <h1 className="md:text-4xl  text-3xl font-bold text-white mt-20">
        Dev.
        <span className="bg-gradient-to-b from-blue-200 to-blue-600 bg-clip-text text-transparent">
          Leandro
        </span>
      </h1>
      <span className="text-gray-50 mb-5 mt-3">Veja meus links 👇</span>

      <main className="flex flex-col w-11/12 max-w-xl text-center">
        {links.map((link) => (
          <section
            style={{ backgroundColor: link.bg }}
            key={link.id}
            className="bg-white mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer"
          >
            <a href={link.url} target="_blank">
              <p style={{ color: link.color }} className="text-base md:text-lg">
                {link.name}
              </p>
            </a>
          </section>
        ))}

        {socialLinks && Object.keys(socialLinks).length > 0 && (
          <footer className="flex justify-center gap-3 my-4">
            <Social url={socialLinks.linkedin}>
              <FaLinkedin size={35} color="#FFF" />
            </Social>

            <Social url={socialLinks.github}>
              <FaGithub size={35} color="#FFF" />
            </Social>
          </footer>
        )}
      </main>
    </div>
  );
}
