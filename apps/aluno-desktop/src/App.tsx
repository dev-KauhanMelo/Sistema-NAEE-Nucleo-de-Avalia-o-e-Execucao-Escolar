import { useState } from "react";
import { TelaEditor } from "./componentes/TelaEditor";
import { TelaLockdown } from "./componentes/TelaLockdown";
import { TelaLogin } from "./componentes/TelaLogin";
import { ToastStrike } from "./componentes/ToastStrike";
import { useDeteccaoFoco } from "./hooks/useDeteccaoFoco";
import { useEstrikes } from "./hooks/useEstrikes";
import type { SessaoAtiva } from "./tipos/sessao";

function App() {
  const [sessao, setSessao] = useState<SessaoAtiva | null>(null);
  const { strikes, ultimoAviso, registrarStrike, resetarDev } = useEstrikes();

  useDeteccaoFoco(sessao !== null && strikes < 3, registrarStrike);

  if (!sessao) {
    return <TelaLogin onAutenticado={setSessao} />;
  }

  return (
    <div className="relative h-screen">
      <TelaEditor sessao={sessao} destacarAtencao={strikes === 2} />
      {strikes === 1 && <ToastStrike key={ultimoAviso} />}
      {strikes >= 3 && <TelaLockdown onResetDev={resetarDev} />}
    </div>
  );
}

export default App;
