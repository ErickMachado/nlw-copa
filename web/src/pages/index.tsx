import Image from "next/image";
import AppNlwCopaPreviewImage from "../assets/app-nlw-copa-preview.png";
import LogoImage from "../assets/logo.svg";
import UsersImage from "../assets/users-avatar-example.png";
import CheckImage from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  guessCount: number;
  poolCount: number;
  userCount: number;
}

export default function Home({ guessCount, poolCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const { data } = await api.post("/pools", { title: poolTitle });

      navigator.clipboard.writeText(data.code);

      alert(
        "Bolão criado com sucesso! O código foi copiado para a área de transferência"
      );

      setPoolTitle("");
    } catch (error) {
      alert("Falha ao criar bolão. Tente novamente");
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={LogoImage} alt="Logo do aplicativo NLW Copa" />
        <h1 className="mt-14 text-white font-bold text-5xl leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={UsersImage} alt="" quality={100} />
          <strong className="font-bold text-gray-100 text-xl">
            <span className="text-ignite-500">+{userCount}</span> pessoas já
            estão usando
          </strong>
        </div>
        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            placeholder="Qual nome do seu bolão?"
            required
            onChange={({ target }) => setPoolTitle(target.value)}
            value={poolTitle}
          />
          <button
            type="submit"
            className="bg-yellow-500 uppercase px-6 py-4 rounded font-bold text-sm text-gray-900 hover:bg-yellow-700 transition-colors"
          >
            Criar meu bolão
          </button>
        </form>
        <p className="mt-4 text-gray-300 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between">
          <div className="flex items-center gap-6">
            <Image src={CheckImage} alt="" />
            <div className="text-gray-100 flex flex-col">
              <span className="text-2xl font-bold leading-snug">
                +{poolCount}
              </span>
              <span className="leading-relaxed">Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-62 bg-gray-600"></div>
          <div className="flex items-center gap-6">
            <Image src={CheckImage} alt="" />
            <div className="text-gray-100 flex flex-col">
              <span className="text-2xl font-bold leading-snug">
                +{guessCount}
              </span>
              <span className="leading-relaxed">Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={AppNlwCopaPreviewImage}
        alt="Dois celulares com imagens do aplicativo NLW copa"
        quality={100}
      />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessesCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessesCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};
