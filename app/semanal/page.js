import { getDados, campo } from "../../lib/sheets";

function formatBRL(valor) {
  const n = Number(String(valor).replace(",", "."));
  if (!valor || Number.isNaN(n)) return valor || "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const revalidate = 60;

export default async function SemanalPage() {
  let dados = null;
  let erro = null;
  try {
    dados = await getDados();
  } catch (e) {
    erro = e?.message || String(e);
  }

  if (erro) {
    return (
      <div>
        <div className="section-title">
          <h2>Relatorio semanal</h2>
        </div>
        <div className="callout warn">
          <strong>Erro ao ler a planilha-ponte:</strong> {erro}
        </div>
      </div>
    );
  }

  const periodo = campo(dados, "semana.periodo");
  const entradas = campo(dados, "semana.entradas_projetadas");
  const saidas = campo(dados, "semana.saidas_projetadas");
  const resultado = campo(dados, "semana.resultado_liquido_projetado");
  const atualizadoEm = campo(dados, "semana.atualizado_em");

  const semDados = !periodo && !entradas && !saidas && !resultado;

  return (
    <div>
      <div className="section-title">
        <h2>Relatorio semanal</h2>
        {periodo ? <span className="mono">{periodo}</span> : null}
      </div>

      {semDados ? (
        <div className="callout">
          Ainda sem dados semanais. A rotina de relatorio semanal ainda nao
          rodou ou nao gravou valores na planilha-ponte.
        </div>
      ) : (
        <>
          <div className="kpi-grid">
            <div className="kpi">
              <span className="label">Entradas projetadas</span>
              <span className="value mono">{formatBRL(entradas)}</span>
            </div>
            <div className="kpi">
              <span className="label">Saidas projetadas</span>
              <span className="value mono">{formatBRL(saidas)}</span>
            </div>
            <div className="kpi">
              <span className="label">Resultado liquido projetado</span>
              <span className="value mono">{formatBRL(resultado)}</span>
            </div>
          </div>
          <div className="callout">
            <strong>Atualizado em:</strong> {atualizadoEm || "—"}
          </div>
        </>
      )}
    </div>
  );
}
