import React, { useState } from 'react';
import { Problem } from '../types/mathGame';
import { Layers, Grid3X3, SplitSquareVertical, Sparkles } from 'lucide-react';

interface Props {
  problem: Problem;
}

export const InteractiveManipulatives: React.FC<Props> = ({ problem }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'dourado' | 'qvl'>('visual');
  const [highlightItems, setHighlightItems] = useState(false);

  const [num1, num2] = problem.numbers;

  // Material Dourado calculations
  const tens1 = Math.floor(num1 / 10);
  const units1 = num1 % 10;
  const tens2 = Math.floor(num2 / 10);
  const units2 = num2 % 10;

  const resultTens = Math.floor(problem.correctAnswer / 10);
  const resultUnits = problem.correctAnswer % 10;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
            📐
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 font-display">
              Mesa de Investigação Visual
            </h4>
            <p className="text-xs text-slate-500">
              Ferramenta interativa para enxergar e comprovar a conta
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'visual'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            Objetos do Problema
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dourado')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'dourado'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Material Dourado
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qvl')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'qvl'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            Q.V.L. (D e U)
          </button>
        </div>
      </div>

      {/* 1. VISUAL OBJECTS VIEW */}
      {activeTab === 'visual' && (
        <div className="space-y-4">
          {problem.operation === '+' && (
            <div>
              <div className="flex items-center justify-between mb-2 text-xs font-semibold text-slate-600">
                <span>Grupo 1: {num1} {problem.unit}</span>
                <span>➕</span>
                <span>Grupo 2: {num2} {problem.unit}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-800 block mb-2">
                    Parte 1 ({num1} itens)
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto p-1">
                    {Array.from({ length: Math.min(num1, 60) }).map((_, idx) => (
                      <span
                        key={idx}
                        title={`Item ${idx + 1}`}
                        className="text-base select-none hover:scale-125 transition-transform"
                      >
                        {problem.visual.unitEmoji}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100">
                  <span className="text-xs font-bold text-teal-800 block mb-2">
                    Parte 2 ({num2} itens)
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto p-1">
                    {Array.from({ length: Math.min(num2, 60) }).map((_, idx) => (
                      <span
                        key={idx}
                        title={`Item ${idx + 1}`}
                        className="text-base select-none hover:scale-125 transition-transform"
                      >
                        {problem.visual.unitEmoji}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center p-2 bg-slate-50 rounded-lg text-xs text-slate-600 font-medium">
                Juntando as duas partes: <strong className="text-emerald-700">{num1} + {num2} = {problem.correctAnswer} {problem.unit}</strong> no total!
              </div>
            </div>
          )}

          {problem.operation === '-' && (
            <div>
              <div className="flex items-center justify-between mb-2 text-xs font-semibold text-slate-600">
                <span>Total inicial: {num1} {problem.unit}</span>
                <span>Tirando/Comparando: {num2} {problem.unit}</span>
              </div>
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-800">
                    O que sobrou (não riscado) vs O que saiu (riscado):
                  </span>
                  <button
                    type="button"
                    onClick={() => setHighlightItems(!highlightItems)}
                    className="text-xs text-rose-700 font-semibold underline hover:text-rose-900"
                  >
                    {highlightItems ? 'Esconder destaque' : 'Destacar retirada'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto p-1">
                  {Array.from({ length: Math.min(num1, 80) }).map((_, idx) => {
                    const isRemoved = idx < num2;
                    return (
                      <span
                        key={idx}
                        className={`text-base select-none transition-all ${
                          isRemoved
                            ? 'opacity-35 line-through grayscale filter scale-90'
                            : 'hover:scale-125'
                        }`}
                        title={isRemoved ? 'Retirado' : 'Restante'}
                      >
                        {problem.visual.unitEmoji}
                      </span>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-700 border-t border-rose-100 pt-2">
                  <span className="text-rose-700">Riscados: {num2}</span>
                  <span className="font-bold text-slate-900">
                    Restaram: {problem.correctAnswer} {problem.unit}
                  </span>
                </div>
              </div>
            </div>
          )}

          {problem.operation === '*' && (
            <div>
              <div className="flex items-center justify-between mb-2 text-xs font-semibold text-slate-600">
                <span>{num1} Grupos iguais</span>
                <span>×</span>
                <span>{num2} Itens por grupo</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {Array.from({ length: num1 }).map((_, groupIdx) => (
                  <div
                    key={groupIdx}
                    className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 flex flex-col items-center"
                  >
                    <span className="text-xs font-bold text-amber-800 mb-1">
                      Grupo {groupIdx + 1}
                    </span>
                    <div className="flex flex-wrap justify-center gap-1">
                      {Array.from({ length: num2 }).map((_, itemIdx) => (
                        <span key={itemIdx} className="text-base">
                          {problem.visual.unitEmoji}
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] text-amber-700 font-semibold mt-1">
                      {num2} itens
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center p-2 bg-amber-100/50 rounded-lg text-xs text-amber-900 font-medium">
                {Array.from({ length: num1 }).map(() => num2).join(' + ')} = <strong className="text-amber-800">{num1} × {num2} = {problem.correctAnswer} {problem.unit}</strong>
              </div>
            </div>
          )}

          {problem.operation === '/' && (
            <div>
              <div className="flex items-center justify-between mb-2 text-xs font-semibold text-slate-600">
                <span>Total: {num1} {problem.unit}</span>
                <span>Divididos igualmente em {num2} partes</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Array.from({ length: num2 }).map((_, plateIdx) => (
                  <div
                    key={plateIdx}
                    className="p-3 bg-indigo-50/80 rounded-xl border-2 border-dashed border-indigo-200 flex flex-col items-center"
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-bold">
                        {plateIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-indigo-900">
                        Parte / Pratinho {plateIdx + 1}
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1 py-1">
                      {Array.from({ length: problem.correctAnswer }).map((_, itemIdx) => (
                        <span key={itemIdx} className="text-lg">
                          {problem.visual.unitEmoji}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-indigo-700 mt-2">
                      Recebe {problem.correctAnswer} {problem.unit}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center p-2 bg-indigo-100/50 rounded-lg text-xs text-indigo-900 font-medium">
                {num1} {problem.unit} repartidos em {num2} partes iguais = <strong className="text-indigo-800">{problem.correctAnswer} para cada!</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. MATERIAL DOURADO VIEW */}
      {activeTab === 'dourado' && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <strong className="font-semibold">Regra do Material Dourado:</strong>
            </div>
            <span>
              Uma <strong>Barra = 1 Dezena (10 unidades)</strong> | Um <strong>Cubinho = 1 Unidade</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Número {num1}:
              </span>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">
                    {tens1} Barras (Dezenas = {tens1 * 10}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: tens1 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-14 w-4 bg-amber-300 border border-amber-500 rounded-sm flex flex-col justify-between py-0.5 px-0.5 shadow-xs"
                        title="Barra de 10"
                      >
                        {Array.from({ length: 10 }).map((_, j) => (
                          <div key={j} className="h-[2px] bg-amber-600/40 w-full" />
                        ))}
                      </div>
                    ))}
                    {tens1 === 0 && <span className="text-xs text-slate-400">Nenhuma barra</span>}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">
                    {units1} Cubinhos (Unidades = {units1}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: units1 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-3.5 h-3.5 bg-amber-200 border border-amber-400 rounded-xs shadow-xs"
                        title="Cubinho de 1"
                      />
                    ))}
                    {units1 === 0 && <span className="text-xs text-slate-400">Nenhum cubinho</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                {problem.operation === '+' ? `Número ${num2}:` : `Resultado Final (${problem.correctAnswer}):`}
              </span>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">
                    {problem.operation === '+' ? `${tens2} Barras (Dezenas = ${tens2 * 10}):` : `${resultTens} Barras:`}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: problem.operation === '+' ? tens2 : resultTens }).map((_, i) => (
                      <div
                        key={i}
                        className="h-14 w-4 bg-amber-300 border border-amber-500 rounded-sm flex flex-col justify-between py-0.5 px-0.5 shadow-xs"
                      >
                        {Array.from({ length: 10 }).map((_, j) => (
                          <div key={j} className="h-[2px] bg-amber-600/40 w-full" />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">
                    {problem.operation === '+' ? `${units2} Cubinhos (Unidades = ${units2}):` : `${resultUnits} Cubinhos:`}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: problem.operation === '+' ? units2 : resultUnits }).map((_, i) => (
                      <div
                        key={i}
                        className="w-3.5 h-3.5 bg-amber-200 border border-amber-400 rounded-xs shadow-xs"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. QUADRO VALOR DE LUGAR (QVL) */}
      {activeTab === 'qvl' && (
        <div className="max-w-md mx-auto p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-center font-bold text-xs text-slate-700 mb-2">
            Quadro Valor de Lugar (Q.V.L.)
          </div>
          <table className="w-full text-center border-collapse border border-slate-300 rounded-lg overflow-hidden bg-white text-sm font-mono">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                <th className="py-1 px-3 border-r border-slate-300 text-xs font-semibold">Operação</th>
                <th className="py-1 px-3 border-r border-slate-300 text-amber-700 font-bold">D (Dezena)</th>
                <th className="py-1 px-3 text-blue-700 font-bold">U (Unidade)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-2 px-3 border-r border-slate-300 text-xs text-slate-400">1° termo</td>
                <td className="py-2 px-3 border-r border-slate-300 font-bold">{tens1}</td>
                <td className="py-2 px-3 font-bold">{units1}</td>
              </tr>
              <tr className="border-b-2 border-slate-800">
                <td className="py-2 px-3 border-r border-slate-300 font-bold text-slate-800">
                  {problem.operation === '*' ? '×' : problem.operation}
                </td>
                <td className="py-2 px-3 border-r border-slate-300 font-bold">
                  {num2 >= 10 ? tens2 : '-'}
                </td>
                <td className="py-2 px-3 font-bold">{units2}</td>
              </tr>
              <tr className="bg-emerald-50 text-emerald-900 font-bold text-base">
                <td className="py-2 px-3 border-r border-slate-300 text-xs font-sans text-emerald-800">
                  Total
                </td>
                <td className="py-2 px-3 border-r border-slate-300">{resultTens}</td>
                <td className="py-2 px-3">{resultUnits}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[11px] text-center text-slate-500 mt-2">
            Total calculado: <strong>{problem.correctAnswer} {problem.unit}</strong>
          </p>
        </div>
      )}
    </div>
  );
};
