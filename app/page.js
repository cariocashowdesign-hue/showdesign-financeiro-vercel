import { getDados, campo, campoJSON } from "../lib/sheets";

function formatBRL(valor) {
  const n = Number(String(valor).replace(",", "."));
  if (!valor || Number.isNaN(n)) return valor || "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const revalidate = 60;

export default async function HomePage() {
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
          <h2>Saldo em caixa</h2>
        </div>
        <div className="callout warn">
          <strong>Erro ao ler a planilha-ponte:</strong> {erro}
        </div>
      </div>
    );
  }

  const saldoItau = campo(dados, "home.saldo_itau");
  const saldoInter = campo(dados, "home.saldo_inter");
  const saldoItauAtualizadoEm = campo(dados, "home.saldo_itau_atualizado_em");
  const saldoInterAtualizadoEm = campo(dados, "home.saldo_inter_atualizado_em");
  const alertasEventos = campoJSON(dados, "home.alertas_eventos", []);

  const semDados = !saldoItau && !saldoInter;

  return (
    <div>
      <div className="section-title">
        <h2>Saldo em caixa</h2>
      </div>

      {semDados ? (
        <div className="callout">
          Ainda sem dados de saldo. A rotina de saldo em caixa ainda nao rodou
          ou nao gravou valores na planilha-ponte.
        </div>
      ) : (
        <div className="panel">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Conta</th>
                  <th className="num">Saldo</th>
                  <th>Atualizado em</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Itau</td>
                  <td className="num mono">{formatBRL(saldoItau)}</td>
                  <td className="mono">{saldoItauAtualizadoEm || "—"}</td>
                </tr>
                <tr>
                  <td>Inter</td>
                  <td className="num mono">{formatBRL(saldoInter)}</td>
                  <td className="mono">{saldoInterAtualizadoEm || "—"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="section-title">
        <h2>Alertas de eventos</h2>
      </div>

      {alertasEventos.length === 0 ? (
        <div className="callout">Nenhum alerta critico no momento.</div>
      ) : (
        alertasEventos.map((a, i) => (
          <div className="callout warn" key={i} style={{ marginBottom: "10px" }}>
            <strong>{a.evento || "Evento"}</strong>
            {a.cliente ? <> — {a.cliente}</> : null}
            {a.motivo ? <div>{a.motivo}</div> : null}
            {a.valor ? <div className="mono">{formatBRL(a.valor)}</div> : null}
          </div>
        ))
      )}
    </div>
  );
}
