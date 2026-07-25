import { Cabecalho } from "./componentes/Cabecalho";
import { FeedEventos } from "./componentes/FeedEventos";
import { GradeEstacoes } from "./componentes/GradeEstacoes";
import { ListaQuestoes } from "./componentes/ListaQuestoes";
import { useAgora } from "./hooks/useAgora";
import { useEstacoes } from "./hooks/useEstacoes";
import { useEventos } from "./hooks/useEventos";

function App() {
  const { estacoes, conectado } = useEstacoes();
  const eventos = useEventos();
  const agora = useAgora();

  const lista = Object.values(estacoes);
  const totalBloqueadas = lista.filter((estacao) => estacao.status === "bloqueado").length;

  return (
    <div className="flex min-h-screen flex-col">
      <Cabecalho conectado={conectado} totalEstacoes={lista.length} totalBloqueadas={totalBloqueadas} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-8 lg:flex-row">
        <section className="flex flex-1 flex-col gap-10">
          <GradeEstacoes estacoes={estacoes} agora={agora} />
          <ListaQuestoes />
        </section>

        <aside className="w-full shrink-0 lg:w-80">
          <FeedEventos eventos={eventos} agora={agora} />
        </aside>
      </main>
    </div>
  );
}

export default App;
