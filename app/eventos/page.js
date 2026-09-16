import { getDados, campo, campoObs, campoJSON } from "../../lib/sheets";

function formatBRL(valor) {
  const n = Number(String(valor).replace(",", "."));
  if (!valor || Number.isNaN(n)) return valor || "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function saudeChip(saude) {
  if (saude === "critico") return <span className="chip bad">Critico</span>;
  if (saude === "atencao") return <span className="chip warn">Atencao</span>;
  if (saude === "saudavel") return <span className="chip good">Saudavel</span>;
  return null;
}

export const revalidate = 60;

export default async function EventosPage() {
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
          <h2>Margem por evento</h2>
        </div>
        <div className="callout warn">
          <strong>Erro ao ler a planilha-ponte:</strong> {erro}
        </div>
      </div>
    );
  }

  const proximos = campoJSON(dados, "eventos.proximos", []);
  const margemMediaValor = campo(dados, "eventos.margem_media_mes_valor");
  const margemMediaNota = campo(dados, "eventos.margem_media_mes_nota");
  const ranking = campoJSON(dados, "eventos.ranking", []);
  const destaques = campoJSON(dados, "eventos.destaques", []);
  const semFaturamento = campoJSON(dados, "eventos.sem_faturamento", []);
  const criticos = campoJSON(dados, "eventos.criticos", []);
  const escopoNota = campoObs(dados, "eventos.escopo_nota") || campo(dados, "eventos.escopo_nota");
  const atualizadoEm = campo(dados, "eventos.atualizado_em");

  const andamento = ranking.filter((e) => e.momento === "andamento");
  const realizados = ranking.filter((e) => e.momento === "realizados" || !e.momento);

  return (
    <div>
      <div className="section-title">
        <h2>Proximos eventos</h2>
      </div>
      {proximos.length === 0 ? (
        <div className="callout">Nenhum evento futuro cadastrado.</div>
      ) : (
        <div className="panel">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th className="num">Valor previsto</th>
                </tr>
              </thead>
              <tbody>
                {proximos.map((e, i) => (
                  <tr key={i}>
                    <td>{e.evento || "—"}</td>
                    <td>{e.cliente || "—"}</td>
                    <td className="mono">{e.data || "—"}</td>
                    <td className="num mono">{formatBRL(e.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="section-title">
        <h2>Margem media do mes</h2>
      </div>
      <div className="kpi-grid">
        <div className="kpi">
          <span className="label">Margem media (valor)</span>
          <span className="value mono">{formatBRL(margemMediaValor)}</span>
        </div>
        <div className="kpi">
          <span className="label">Margem media (nota)</span>
          <span className="value mono">{margemMediaNota || "—"}</span>
        </div>
      </div>

      <div className="section-title">
        <h2>Em andamento</h2>
      </div>
      {andamento.length === 0 ? (
        <div className="callout">Nenhum evento em andamento no momento.</div>
      ) : (
        <div className="panel">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Cliente</th>
                  <th className="num">Receita</th>
                  <th className="num">Custo</th>
                  <th className="num">Margem</th>
                  <th>Saude</th>
                </tr>
              </thead>
              <tbody>
                {andamento.map((e, i) => (
                  <tr key={i}>
                    <td>{e.evento || "—"}</td>
                    <td>{e.cliente || "—"}</td>
                    <td className="num mono">{formatBRL(e.receita)}</td>
                    <td className="num mono">{formatBRL(e.custo)}</td>
                    <td className="num mono">{formatBRL(e.margem)}</td>
                    <td>{saudeChip(e.saude)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="section-title">
        <h2>Ja realizados</h2>
      </div>
      {realizados.length === 0 ? (
        <div className="callout">Nenhum evento realizado listado.</div>
      ) : (
        <div className="panel">
          {realizados.map((e, i) => (
            <details key={i} style={{ borderBottom: i < realizados.length - 1 ? "1px solid var(--rule)" : "none", paddingBlock: "10px" }}>
              <summary style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <span>
                  {e.evento || "—"} {e.cliente ? <span className="mono" style={{ color: "var(--ink-muted)" }}> — {e.cliente}</span> : null}
                </span>
                <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span className="mono">{formatBRL(e.margem)}</span>
                  {saudeChip(e.saude)}
                </span>
              </summary>
              <div style={{ paddingTop: "12px" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th className="num">Custo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(e.custos || []).length === 0 ? (
                      <tr>
                        <td colSpan={2} style={{ color: "var(--ink-muted)" }}>
                          Sem detalhamento de custos por categoria.
                        </td>
                      </tr>
                    ) : (
                      (e.custos || []).map((c, j) => (
                        <tr key={j}>
                          <td>{c.categoria || "—"}</td>
                          <td className="num mono">{formatBRL(c.valor)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
        </div>
      )}

      <div className="section-title">
        <h2>Sem faturamento</h2>
      </div>
      {semFaturamento.length === 0 ? (
        <div className="callout">Nenhum evento pendente de faturamento.</div>
      ) : (
        <div className="panel">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Cliente</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {semFaturamento.map((e, i) => (
                  <tr key={i}>
                    <td>{e.evento || "—"}</td>
                    <td>{e.cliente || "—"}</td>
                    <td className="mono">{e.data || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="section-title">
        <h2>Eventos criticos</h2>
      </div>
      {criticos.length === 0 ? (
        <div className="callout">Nenhum evento critico no momento.</div>
      ) : (
        criticos.map((e, i) => (
          <div className="callout warn" key={i} style={{ marginBottom: "10px" }}>
            <strong>{e.evento || "Evento"}</strong>
            {e.cliente ? <> — {e.cliente}</> : null}
            {e.motivo ? <div>{e.motivo}</div> : null}
          </div>
        ))
      )}

      <div className="section-title">
        <h2>Destaques do mes</h2>
      </div>
      {destaques.length === 0 ? (
        <div className="callout">Sem destaques no momento.</div>
      ) : (
        <div className="kpi-grid">
          {destaques.map((d, i) => (
            <div className="kpi" key={i}>
              <span className="label">{d.label || "—"}</span>
              <span className="value mono">{d.valor || "—"}</span>
            </div>
          ))}
        </div>
      )}

      {escopoNota ? (
        <div className="callout" style={{ marginTop: "16px" }}>
          <strong>Escopo:</strong> {escopoNota}
        </div>
      ) : null}

      <div className="callout" style={{ marginTop: "16px" }}>
        <strong>Atualizado em:</strong> {atualizadoEm || "—"}
      </div>
    </div>
  );
}
