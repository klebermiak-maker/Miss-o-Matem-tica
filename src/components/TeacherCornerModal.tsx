import React from 'react';
import { X, BookOpen, CheckCircle2, FileText, Sparkles, Printer, BarChart3 } from 'lucide-react';
import { MISSIONS_DATA } from '../data/missionsData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenReport?: () => void;
}

export const TeacherCornerModal: React.FC<Props> = ({ isOpen, onClose, onOpenReport }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-display">
                Guia Pedagógico da Professora Simone Rosa
              </h3>
              <p className="text-xs text-slate-300">
                Escola Municipal Educandário Nossa Senhora Aparecida · 3° ANO B Matutino
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenReport && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReport();
                }}
                className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 shadow-2xs"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desempenho do Aluno</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-1.5 border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Guia
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* BNCC Alignment */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Alinhamento à BNCC & Objetivos de Aprendizagem</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              <strong>Habilidade EF03CO02 / EF03MA06:</strong> Resolver e elaborar situações-problema envolvendo as quatro operações em situações simples; interpretar enunciados identificando a operação necessária (adição, subtração, multiplicação e divisão) com suporte de recursos manipulativos e representações visuais.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-amber-900">
              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200">
                <strong>➕ Adição:</strong> Ideias de juntar e acrescentar.
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200">
                <strong>➖ Subtração:</strong> Ideias de retirar, comparar ("quantos a mais") e completar ("quanto falta").
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200">
                <strong>✖️ Multiplicação:</strong> Adição de parcelas iguais e disposição retangular.
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200">
                <strong>➗ Divisão:</strong> Repartição equitativa e ideia de medida (quantos cabem).
              </div>
            </div>
          </div>

          {/* Roteiro da Aula */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm font-display flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Roteiro de 50 minutos para a 3ª Aula (Quinta-feira)
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-indigo-700 block mb-0.5">
                  1. Roda de Abertura & Interpretação Coletiva (10 min):
                </span>
                Projete o jogo no quadro ou nos computadores/tablets. Mostre a Missão 1 e leia o primeiro enunciado. Peça que as crianças usem a "Lupa de Pistas" para encontrar as palavras mágicas: "juntou", "no total", "quantos sobraram".
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-indigo-700 block mb-0.5">
                  2. Identificação da Operação & Debate (15 min):
                </span>
                Foque no Passo 2: incentive as duplas a justificarem por que escolheram a operação antes de calcular o resultado numérico. Evite que apenas somem os números sem pensar no sentido da ação.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-indigo-700 block mb-0.5">
                  3. Exploração com Material Dourado & QVL (15 min):
                </span>
                Abra a "Mesa de Investigação Visual" para verificar as dezenas e unidades concretamente. As crianças podem acompanhar no caderno ou com seus estojos de blocos dourados físicos.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-indigo-700 block mb-0.5">
                  4. Conquista das Medalhas & Certificado (10 min):
                </span>
                Ao finalizar as 4 missões, cada aluno digita seu nome e gera seu Certificado Oficial da Professora Simone Rosa para levar para casa ou colar no caderno de Matemática!
              </div>
            </div>
          </div>

          {/* Gabarito Comentado */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm font-display flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Gabarito Rápido das 4 Missões
            </h4>
            <div className="space-y-2 text-xs">
              {MISSIONS_DATA.map((m) => (
                <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-slate-800">
                      Missão {m.id}: {m.title} ({m.operationName})
                    </strong>
                    <span className="font-mono font-bold text-slate-600">
                      Operação: {m.operation === '*' ? '×' : m.operation === '/' ? '÷' : m.operation}
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {m.problems.map((p, idx) => (
                      <li key={p.id}>
                        Desafio {idx + 1}: <strong>{p.numbers[0]} {m.operation === '*' ? '×' : m.operation === '/' ? '÷' : m.operation} {p.numbers[1]} = {p.correctAnswer} {p.unit}</strong> ({p.themeContext})
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
