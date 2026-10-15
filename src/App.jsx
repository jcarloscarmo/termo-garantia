import { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Trash2, Plus, FileDown, Smartphone, User, Hash, Calendar, MapPin, Wrench } from 'lucide-react';

export default function App() {
  const [form, setForm] = useState({
    os: '',
    cliente: '',
    aparelho: '',
    imei: '',
    dataServico: new Date().toISOString().split('T')[0],
    servico: 'Troca de tela/display (Padrão)',
    cidade: 'Potim',
    dataEmissao: new Date().toISOString().split('T')[0],
  });

  const [fotos, setFotos] = useState([null, null]);
  const pdfRef = useRef(null);
  const sigClienteRef = useRef(null);
  const sigLojaRef = useRef(null);
  const [sigCliente, setSigCliente] = useState('');
  const [sigLoja, setSigLoja] = useState('');

  const servicos = [
    "Troca de tela/display (Padrão)",
    "Troca de bateria",
    "Troca de conector de carga",
    "Banho químico",
    "Outros"
  ];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFoto = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newFotos = [...fotos];
      newFotos[index] = reader.result;
      setFotos(newFotos);
    };
    reader.readAsDataURL(file);
  };

  const removeFoto = (index) => {
    const newFotos = fotos.filter((_, i) => i !== index);
    setFotos(newFotos.length > 0 ? newFotos : [null]);
  };

  const formatDataExtenso = (dataISO) => {
    if (!dataISO) return '';
    const d = new Date(dataISO + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const salvarAssinatura = (ref, setter) => {
    if (ref.current && !ref.current.isEmpty()) {
      setter(ref.current.toDataURL('image/png'));
    }
  };

  const gerarPDF = async () => {
    if (!form.cliente || !form.aparelho) {
      alert('Preencha Cliente e Aparelho antes de gerar.');
      return;
    }

    // Garante que assinaturas atuais sejam salvas no preview caso não tenham disparado onEnd
    if (sigClienteRef.current && !sigClienteRef.current.isEmpty() && !sigCliente) {
      setSigCliente(sigClienteRef.current.toDataURL('image/png'));
    }
    if (sigLojaRef.current && !sigLojaRef.current.isEmpty() && !sigLoja) {
      setSigLoja(sigLojaRef.current.toDataURL('image/png'));
    }

    // Pequeno delay para renderizar as assinaturas no DOM caso tenham acabado de atualizar
    await new Promise((r) => setTimeout(r, 100));

    const element = pdfRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let y = 0;
    let remainingHeight = pdfHeight;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, y, pdfWidth, pdfHeight);
    remainingHeight -= pageHeight;

    while (remainingHeight > 0) {
      y -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, y, pdfWidth, pdfHeight);
      remainingHeight -= pageHeight;
    }

    pdf.save(`Garantia_Jcell_OS-${form.os || 'S-N'}_${form.cliente || 'Cliente'}.pdf`);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col lg:flex-row">
      {/* FORMULÁRIO - NÃO VAI NO PDF */}
      <div className="w-full lg:w-[420px] bg-white p-6 shadow-xl lg:h-screen lg:overflow-y-auto shrink-0">
        <h1 className="text-xl font-bold flex gap-2 items-center">
          <Wrench className="w-5 h-5 text-zinc-800" /> Jcell
        </h1>
        <p className="text-xs text-zinc-500 mb-6">Assistência Técnica em Celulares • Potim / Roseira</p>

        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold flex gap-1 items-center">
              <Hash className="w-3 h-3" /> OS
            </span>
            <input
              name="os"
              value={form.os}
              onChange={handleChange}
              className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-black outline-none"
              placeholder="Ex: 1023"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold flex gap-1 items-center">
              <User className="w-3 h-3" /> Cliente
            </span>
            <input
              name="cliente"
              value={form.cliente}
              onChange={handleChange}
              className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-black outline-none"
              placeholder="Nome completo"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold flex gap-1 items-center">
              <Smartphone className="w-3 h-3" /> Aparelho
            </span>
            <input
              name="aparelho"
              value={form.aparelho}
              onChange={handleChange}
              className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-black outline-none"
              placeholder="iPhone 13 Pro"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold">IMEI</span>
            <input
              name="imei"
              value={form.imei}
              onChange={handleChange}
              className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-black outline-none"
              placeholder="Ex: 356789123456789"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-xs font-semibold flex gap-1 items-center">
                <Calendar className="w-3 h-3" /> Data do Serviço
              </span>
              <input
                type="date"
                name="dataServico"
                value={form.dataServico}
                onChange={handleChange}
                className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-black outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold flex gap-1 items-center">
                <Calendar className="w-3 h-3" /> Data Emissão
              </span>
              <input
                type="date"
                name="dataEmissao"
                value={form.dataEmissao}
                onChange={handleChange}
                className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-black outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold">Serviço Realizado</span>
            <select
              name="servico"
              value={form.servico}
              onChange={handleChange}
              className="w-full border rounded p-2 text-sm bg-white focus:ring-1 focus:ring-black outline-none"
            >
              {servicos.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold flex gap-1 items-center">
              <MapPin className="w-3 h-3" /> Cidade
            </span>
            <select
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
              className="w-full border rounded p-2 text-sm bg-white focus:ring-1 focus:ring-black outline-none"
            >
              <option value="Potim">Potim</option>
              <option value="Roseira">Roseira</option>
            </select>
          </label>

          <hr className="my-4" />
          <h3 className="font-bold text-sm">Fotos / Evidências</h3>
          {fotos.map((foto, i) => (
            <div key={i} className="border border-dashed rounded p-2 relative bg-zinc-50">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFoto(i, e.target.files[0])}
                  className="text-xs w-full file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-zinc-200 file:text-zinc-700 hover:file:bg-zinc-300 cursor-pointer"
                />
                {fotos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFoto(i)}
                    className="text-zinc-400 hover:text-red-500 p-1"
                    title="Remover foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {foto && (
                <img
                  src={foto}
                  alt={`Evidência ${i + 1}`}
                  className="mt-2 rounded w-full h-32 object-cover border"
                />
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => setFotos([...fotos, null])}
            className="w-full flex justify-center items-center gap-2 border border-zinc-300 rounded p-2 text-sm hover:bg-zinc-50 transition-colors font-medium text-zinc-700"
          >
            <Plus className="w-4 h-4" /> Adicionar mais fotos
          </button>

          <hr className="my-4" />
          <h3 className="font-bold text-sm">Assinaturas</h3>

          <div>
            <p className="text-xs mb-1 font-semibold text-zinc-700">Cliente</p>
            <div className="border rounded bg-white overflow-hidden shadow-inner">
              <SignatureCanvas
                ref={sigClienteRef}
                penColor="black"
                canvasProps={{ className: "w-full h-28 touch-none cursor-crosshair" }}
                onEnd={() => salvarAssinatura(sigClienteRef, setSigCliente)}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                sigClienteRef.current?.clear();
                setSigCliente('');
              }}
              className="text-xs flex items-center gap-1 mt-1 text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-3 h-3" /> Limpar
            </button>
          </div>

          <div className="mt-3">
            <p className="text-xs mb-1 font-semibold text-zinc-700">Jcell (Técnico / Loja)</p>
            <div className="border rounded bg-white overflow-hidden shadow-inner">
              <SignatureCanvas
                ref={sigLojaRef}
                penColor="black"
                canvasProps={{ className: "w-full h-28 touch-none cursor-crosshair" }}
                onEnd={() => salvarAssinatura(sigLojaRef, setSigLoja)}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                sigLojaRef.current?.clear();
                setSigLoja('');
              }}
              className="text-xs flex items-center gap-1 mt-1 text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-3 h-3" /> Limpar
            </button>
          </div>

          <button
            type="button"
            onClick={gerarPDF}
            className="w-full bg-black text-white rounded-lg p-3 font-bold flex justify-center items-center gap-2 mt-6 hover:bg-zinc-800 transition-colors shadow-md"
          >
            <FileDown className="w-5 h-5" /> Gerar e Salvar PDF
          </button>
        </div>
      </div>

      {/* PREVIEW - VAI NO PDF */}
      <div className="flex-1 p-4 lg:p-8 bg-zinc-200 overflow-auto flex justify-center">
        <div
          ref={pdfRef}
          className="bg-white w-full max-w-[794px] min-h-[1123px] p-10 text-[11px] leading-[1.5] text-black shadow-lg"
        >
          {/* CABEÇALHO DA EMPRESA */}
          <div className="text-center border-b-2 border-zinc-900 pb-3 mb-5">
            <h1 className="text-2xl font-black tracking-wider text-black">JCELL</h1>
            <p className="text-[12px] font-bold text-zinc-800 uppercase tracking-widest">
              Assistência Técnica em Celulares
            </p>
            <p className="text-[10px] text-zinc-500 font-medium mt-0.5">Potim / Roseira - SP</p>
            <div className="mt-3 bg-zinc-100 py-1.5 px-3 border border-zinc-300">
              <h2 className="text-center font-bold text-[13px] uppercase tracking-wide text-zinc-900">
                TERMO DE GARANTIA – {form.servico.toUpperCase()}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-6 border border-zinc-300 p-3 text-[12px] rounded-sm bg-zinc-50/50">
            <p><b>Ordem de Serviço (OS):</b> {form.os || '—'}</p>
            <p>
              <b>Data do serviço:</b> {form.dataServico ? new Date(form.dataServico + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
            </p>
            <p className="col-span-2"><b>Cliente:</b> {form.cliente || '—'}</p>
            <p><b>Aparelho:</b> {form.aparelho || '—'}</p>
            <p><b>IMEI:</b> {form.imei || '—'}</p>
            <p className="col-span-2"><b>Serviço realizado:</b> {form.servico}</p>
          </div>

          <h2 className="font-bold text-[12px] mb-2 uppercase border-b pb-1">CONDIÇÕES DA GARANTIA</h2>
          <div className="space-y-2 text-justify">
            <p>
              <b>1.</b> O serviço realizado possui garantia legal de <b>90 (noventa) dias</b>, conforme previsto no Artigo 26, inciso II, do Código de Defesa do Consumidor (CDC), cobrindo exclusivamente eventuais vícios relacionados à peça fornecida e/ou à execução do serviço.
            </p>
            <p>
              <b>2.</b> A presente garantia <b>NÃO COBRE</b> danos decorrentes de:<br/>
              • Quedas, impactos ou choques físicos;<br/>
              • Pressão excessiva sobre a tela ou chassi;<br/>
              • Trincas, quebras, riscos ou manchas (vazamento de display/listras) causados após a entrega do aparelho;<br/>
              • Contato com água, umidade, vapor ou outros líquidos (mesmo em aparelhos ditos à prova d'água);<br/>
              • Mau uso, negligência ou utilização inadequada do aparelho pelo usuário e/ou carregadores de má qualidade;<br/>
              • Danos decorrentes de tentativa de reparo, modificação de software ou abertura do aparelho por terceiros não autorizados;<br/>
              • Rompimento ou violação do selo de garantia interno da loja (se aplicável).
            </p>
            <p>
              <b>3.</b> Em caso de acionamento da garantia, o aparelho deverá ser apresentado na loja para avaliação técnica (com prazo legal de até 30 dias para laudo e resolução), a fim de verificar a origem do problema. A <b>Jcell</b> não se responsabiliza por eventuais perdas de dados, sendo o backup de inteira responsabilidade do cliente antes de deixar o equipamento.
            </p>
            <p>
              <b>4.</b> Constatado que o problema decorre de vício da peça ou falha na nossa execução, o reparo será refeito sem custo adicional ao consumidor.
            </p>
            <p>
              <b>5.</b> Caso o laudo técnico constate que o dano decorreu de agentes externos, mau uso ou qualquer item listado na cláusula 2, a garantia será automaticamente cancelada.
            </p>
            <p className="pt-4">
              Declaro que li, compreendi e concordo com os termos acima, e atesto que recebi meu aparelho nas condições demonstradas nas fotos em anexo e com o serviço testado e aprovado.
            </p>
            <p className="pt-4 font-bold">
              {form.cidade}, {formatDataExtenso(form.dataEmissao)}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-10">
            <div className="text-center">
              <div className="h-16 flex items-end justify-center">
                {sigCliente && <img src={sigCliente} alt="Assinatura Cliente" className="h-16 max-w-full object-contain" />}
              </div>
              <div className="border-t border-black mt-1 pt-1">
                <b>{form.cliente || 'Nome do Cliente'}</b><br />
                <span className="text-[10px] text-zinc-600">Cliente</span>
              </div>
            </div>
            <div className="text-center">
              <div className="h-16 flex items-end justify-center">
                {sigLoja && <img src={sigLoja} alt="Assinatura Jcell" className="h-16 max-w-full object-contain" />}
              </div>
              <div className="border-t border-black mt-1 pt-1">
                <b>Jcell – Assistência Técnica</b><br />
                <span className="text-[10px] text-zinc-600">Assinatura do Técnico Responsável</span>
              </div>
            </div>
          </div>

          {fotos.some(f => Boolean(f)) && (
            <div className="mt-16 break-inside-avoid">
              <h2 className="font-bold text-[12px] mb-3 border-t pt-4 uppercase">
                ANEXO: REGISTROS FOTOGRÁFICOS DO APARELHO
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {fotos.filter(Boolean).map((f, i) => (
                  <div key={i} className="border rounded p-1 bg-zinc-50">
                    <img src={f} alt={`Evidência ${i + 1}`} className="w-full h-44 border rounded object-cover" />
                    <p className="text-[10px] text-center text-zinc-500 mt-1">Foto {i + 1} - Estado no momento da entrega</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
