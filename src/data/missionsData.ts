import { Mission } from '../types/mathGame';

export const MISSIONS_DATA: Mission[] = [
  {
    id: 1,
    title: 'Missão 1: A Feira da Estação',
    subtitle: 'Adição ➕ (Juntar e Acrescentar)',
    operation: '+',
    operationName: 'Adição',
    operationConcept: 'Usamos a Adição quando queremos JUNTAR duas quantidades ou ACRESCENTAR uma quantidade a outra.',
    accentColor: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800',
      text: 'text-emerald-700',
      gradient: 'from-emerald-500 to-teal-600',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    iconName: 'Apple',
    themeBanner: 'Bancas coloridas com frutas fresquinhas e legumes colhidos no sítio.',
    storyIntro: 'Bem-vindos à Feira da Estação! Hoje os alunos do 3° Ano B vão ajudar o Seu Zé a organizar as caixas e calcular as vendas do dia.',
    problems: [
      {
        id: 'm1_p1',
        themeContext: 'Barraca das Frutas Vermelhas',
        statement: 'Na banca do Seu Zé havia 24 maçãs vermelhas em uma cesta e 15 maçãs verdes em outra cesta. Ele resolveu juntar todas as maçãs para montar uma grande oferta.',
        question: 'Quantas maçãs há no total nessa cesta?',
        keywords: ['juntar todas', 'no total', 'havia 24', 'e 15'],
        operation: '+',
        numbers: [24, 15],
        correctAnswer: 39,
        unit: 'maçãs',
        options: [39, 9, 35, 42],
        visual: {
          type: 'counters',
          total: 39,
          part1: 24,
          part2: 15,
          unitEmoji: '🍎',
        },
        explanation: {
          step1_interpret: 'A palavra-chave "juntar todas" e a pergunta "quantas há no total" indicam que estamos reunindo dois grupos de maçãs.',
          step2_operation: 'A operação necessária é a ADIÇÃO (+), pois juntamos 24 com 15.',
          step3_calculation: 'Calculando: 24 + 15 = (20 + 10) + (4 + 5) = 30 + 9 = 39 maçãs.',
          pedagogicalTip: 'Dica da Professora Simone: Ao somar números de dois algarismos, some primeiro as dezenas e depois as unidades!'
        },
        masterClue: {
          title: 'Dica de Mestre: Ação de Juntar!',
          interpretationClue: 'A palavra-chave do texto é "juntar todas". O Seu Zé tinha duas cestas separadas e colocou tudo junto no mesmo lugar.',
          keywordHighlight: 'juntar todas / no total',
          operationHint: 'Quando colocamos duas partes juntas para descobrir o total, usamos a ADIÇÃO (+).',
          visualSchema: 'combine'
        }
      },
      {
        id: 'm1_p2',
        themeContext: 'Banca de Laranjas e Mexericas',
        statement: 'Dona Clara foi à feira e comprou 32 laranjas para fazer suco fresco. No caminho de volta, ela encontrou uma promoção e acrescentou mais 16 laranjas à sua sacola.',
        question: 'Com quantas laranjas Dona Clara ficou ao todo?',
        keywords: ['acrescentou mais', 'ficou ao todo', '32 laranjas', 'mais 16'],
        operation: '+',
        numbers: [32, 16],
        correctAnswer: 48,
        unit: 'laranjas',
        options: [48, 16, 46, 52],
        visual: {
          type: 'counters',
          total: 48,
          part1: 32,
          part2: 16,
          unitEmoji: '🍊',
        },
        explanation: {
          step1_interpret: 'Dona Clara já possuía uma quantia e "acrescentou mais", aumentando a quantidade total da sacola.',
          step2_operation: 'A operação indicada pela ideia de acrescentar é a ADIÇÃO (+).',
          step3_calculation: 'Calculando: 32 + 16 = 30 + 10 + 2 + 6 = 40 + 8 = 48 laranjas.',
          pedagogicalTip: 'Dica da Professora Simone: Sempre que uma quantidade ganha um acréscimo, o total fica maior! 32 + 16 = 48.'
        },
        masterClue: {
          title: 'Dica de Mestre: Ação de Acrescentar!',
          interpretationClue: 'Preste atenção na expressão "acrescentou mais 16". A quantidade inicial (32) aumentou porque novas laranjas entraram na sacola.',
          keywordHighlight: 'acrescentou mais / ficou ao todo',
          operationHint: 'Aumentar uma quantidade já existente é a ideia de acrescentar da ADIÇÃO (+).',
          visualSchema: 'combine'
        }
      },
      {
        id: 'm1_p3',
        themeContext: 'Pastelaria da Feira Escolar',
        statement: 'Para o lanche da turma, a turma do 3° Ano B encomendou 45 pasteis de queijo e 23 pasteis de carne na barraca da Dona Maria.',
        question: 'Quantos pasteis foram encomendados ao todo para a turma?',
        keywords: ['encomendou 45', 'e 23', 'ao todo'],
        operation: '+',
        numbers: [45, 23],
        correctAnswer: 68,
        unit: 'pasteis',
        options: [68, 22, 65, 70],
        visual: {
          type: 'counters',
          total: 68,
          part1: 45,
          part2: 23,
          unitEmoji: '🥟',
        },
        explanation: {
          step1_interpret: 'Temos dois tipos de pasteis e queremos descobrir a quantidade total combinada encomendada pela turma.',
          step2_operation: 'Ideia de JUNTAR partes em um todo: usamos a ADIÇÃO (+).',
          step3_calculation: 'Calculando: 45 + 23 = (40 + 20) + (5 + 3) = 60 + 8 = 68 pasteis.',
          pedagogicalTip: 'Dica da Professora Simone: Observe que 5 unidades mais 3 unidades formam 8 unidades, e 4 dezenas mais 2 dezenas formam 6 dezenas.'
        },
        masterClue: {
          title: 'Dica de Mestre: Reunir Sabores no Total!',
          interpretationClue: 'A pergunta quer saber a quantia "ao todo". Nós temos um grupo de queijo (45) e um grupo de carne (23).',
          keywordHighlight: 'ao todo / 45 e 23',
          operationHint: 'Juntar diferentes grupos para achar o total combinado é uma ADIÇÃO (+).',
          visualSchema: 'combine'
        }
      }
    ]
  },
  {
    id: 2,
    title: 'Missão 2: O Desafio dos Brinquedos',
    subtitle: 'Subtração ➖ (Tirar, Comparar e Completar)',
    operation: '-',
    operationName: 'Subtração',
    operationConcept: 'Usamos a Subtração quando queremos TIRAR uma quantia, descobrir QUANTO FALTA ou comparar QUANTOS A MAIS / A MENOS.',
    accentColor: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      badge: 'bg-rose-100 text-rose-800',
      text: 'text-rose-700',
      gradient: 'from-rose-500 to-pink-600',
      button: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
    iconName: 'Gamepad2',
    themeBanner: 'Prateleiras de brinquedos, carrinhos de madeira e caixas de blocos de montar.',
    storyIntro: 'A brinquedoteca da escola precisa de organização! Os detetives do 3° B vão calcular brinquedos emprestados, estoques e diferenças.',
    problems: [
      {
        id: 'm2_p1',
        themeContext: 'Caixa de Bolinhas de Gude',
        statement: 'Lucas tinha 48 bolinhas de gude em seu saquinho. Durante a recreação, ele perdeu ou doou 15 bolinhas para seu amigo que não tinha nenhuma.',
        question: 'Com quantas bolinhas de gude Lucas ficou no final?',
        keywords: ['tinha 48', 'doou 15', 'com quantas ficou', 'tirar'],
        operation: '-',
        numbers: [48, 15],
        correctAnswer: 33,
        unit: 'bolinhas',
        options: [33, 63, 23, 35],
        visual: {
          type: 'counters',
          total: 48,
          part1: 33,
          part2: 15,
          unitEmoji: '🔮',
        },
        explanation: {
          step1_interpret: 'Lucas tinha uma quantidade inicial e uma parte foi retirada (doada), restando o que sobrou.',
          step2_operation: 'Ideia de RETIRAR / TIRAR uma parte de um total: usamos a SUBTRAÇÃO (-).',
          step3_calculation: 'Calculando: 48 - 15 = 48 - 10 = 38; 38 - 5 = 33 bolinhas.',
          pedagogicalTip: 'Dica da Professora Simone: Na subtração, tiramos unidades de unidades (8 - 5 = 3) e dezenas de dezenas (4 - 1 = 3).'
        },
        masterClue: {
          title: 'Dica de Mestre: Ação de Retirar!',
          interpretationClue: 'Lucas tinha 48 e doou 15. Quando uma parte sai do grupo, a quantidade que resta fica menor do que a inicial.',
          keywordHighlight: 'doou 15 / ficou no final',
          operationHint: 'Tirar uma parte de um total é a ideia de retirar da SUBTRAÇÃO (-).',
          visualSchema: 'separate'
        }
      },
      {
        id: 'm2_p2',
        themeContext: 'Coleção de Figurinhas da Turma',
        statement: 'Marina colou 56 figurinhas em seu álbum dos animais. Seu colega Pedro colou 32 figurinhas no álbum dele.',
        question: 'Quantas figurinhas Marina colou a mais do que Pedro?',
        keywords: ['Marina colou 56', 'Pedro 32', 'quantas a mais', 'comparar'],
        operation: '-',
        numbers: [56, 32],
        correctAnswer: 24,
        unit: 'figurinhas',
        options: [24, 88, 20, 26],
        visual: {
          type: 'counters',
          total: 56,
          part1: 32,
          part2: 24,
          unitEmoji: '🃏',
        },
        explanation: {
          step1_interpret: 'A expressão "quantas a mais" não significa somar! Significa COMPARAR duas quantidades para descobrir a diferença entre elas.',
          step2_operation: 'Para comparar e achar a diferença entre dois valores, fazemos uma SUBTRAÇÃO (-).',
          step3_calculation: 'Calculando a diferença: 56 - 32 = (50 - 30) + (6 - 2) = 20 + 4 = 24 figurinhas.',
          pedagogicalTip: 'Cuidado detetive! "A mais" em perguntas de comparação é a armadilha mais famosa da matemática! Para achar a diferença, nós subtraímos!'
        },
        masterClue: {
          title: 'Dica de Mestre: Cuidado com a Armadilha do "A Mais"!',
          interpretationClue: 'Atenção redobrada! A pergunta "quantas a mais" quer COMPARAR as coleções para saber a diferença de tamanho entre elas, e NÃO somar!',
          keywordHighlight: 'quantas a mais / comparar',
          operationHint: 'Para comparar duas quantidades e encontrar a diferença, usamos a SUBTRAÇÃO (-).',
          visualSchema: 'separate'
        }
      },
      {
        id: 'm2_p3',
        themeContext: 'Montagem do Quebra-Cabeça Gigante',
        statement: 'O quebra-cabeça da sala do 3° Ano B tem 75 peças no total. Até o momento do sinal, os alunos já encaixaram 41 peças.',
        question: 'Quantas peças ainda faltam para completar o quebra-cabeça?',
        keywords: ['tem 75 no total', 'já encaixaram 41', 'ainda faltam para completar'],
        operation: '-',
        numbers: [75, 41],
        correctAnswer: 34,
        unit: 'peças',
        options: [34, 116, 24, 36],
        visual: {
          type: 'counters',
          total: 75,
          part1: 41,
          part2: 34,
          unitEmoji: '🧩',
        },
        explanation: {
          step1_interpret: 'Conhecemos o total necessário (75) e quanto já temos (41). A pergunta quer saber "quanto falta para completar".',
          step2_operation: 'Ideia de COMPLETAR uma quantidade: usamos a SUBTRAÇÃO (-).',
          step3_calculation: 'Calculando: 75 - 41 = 70 - 40 + 5 - 1 = 30 + 4 = 34 peças faltantes.',
          pedagogicalTip: 'Dica da Professora Simone: Pensar em "quanto falta para chegar" é a ideia de completar da subtração!'
        },
        masterClue: {
          title: 'Dica de Mestre: Ideia de Completar!',
          interpretationClue: 'Sabemos a meta final (75) e a parte que já fizemos (41). Queremos descobrir o pedaço que ainda falta para chegar lá.',
          keywordHighlight: 'ainda faltam para completar',
          operationHint: 'Descobrir quanto falta para atingir um total é a ideia de completar da SUBTRAÇÃO (-).',
          visualSchema: 'separate'
        }
      }
    ]
  },
  {
    id: 3,
    title: 'Missão 3: Os Pacotes da Papelaria',
    subtitle: 'Multiplicação ✖️ (Adição de Parcelas Iguais)',
    operation: '*',
    operationName: 'Multiplicação',
    operationConcept: 'Usamos a Multiplicação para somar várias vezes a MESMA quantidade (parcelas iguais) ou em disposições em fileiras.',
    accentColor: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800',
      text: 'text-amber-700',
      gradient: 'from-amber-500 to-orange-500',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    iconName: 'Pencil',
    themeBanner: 'Estojos coloridos, caixas de lápis de cor e pacotes de cadernos novinhos.',
    storyIntro: 'Na papelaria da escola, materiais vêm embalados em pacotes idênticos. O 3° B vai desvendar as quantidades sem precisar contar um por um!',
    problems: [
      {
        id: 'm3_p1',
        themeContext: 'Caixas de Lápis de Cor para Arte',
        statement: 'A Professora Simone comprou 4 caixas de lápis de cor para a aula de artes. Em cada caixa, há exatamente 6 lápis de cores diferentes.',
        question: 'Quantos lápis de cor a professora comprou no total?',
        keywords: ['4 caixas', 'em cada caixa há 6', 'quantos no total', 'parcelas iguais'],
        operation: '*',
        numbers: [4, 6],
        correctAnswer: 24,
        unit: 'lápis',
        options: [24, 10, 20, 28],
        visual: {
          type: 'groups',
          total: 24,
          groups: 4,
          itemsPerGroup: 6,
          unitEmoji: '✏️',
        },
        explanation: {
          step1_interpret: 'Temos 4 caixas e todas têm a mesma quantidade: 6 lápis. É a repetição do número 6 por 4 vezes: 6 + 6 + 6 + 6.',
          step2_operation: 'Quando temos parcelas iguais repetidas, a operação ideal é a MULTIPLICAÇÃO (✖️).',
          step3_calculation: 'Calculando: 4 grupos de 6 = 4 × 6 = 24 lápis.',
          pedagogicalTip: 'Dica da Professora Simone: 4 × 6 é o mesmo que somar: 6 + 6 = 12, 12 + 6 = 18, 18 + 6 = 24!'
        },
        masterClue: {
          title: 'Dica de Mestre: Parcelas Iguais que se Repetem!',
          interpretationClue: 'São 4 caixas com exatamente 6 lápis em CADA uma. Em vez de somar 6 + 6 + 6 + 6, usamos a multiplicação!',
          keywordHighlight: '4 caixas / em cada caixa há 6',
          operationHint: 'Adicionar grupos iguais repetidos é o poder da MULTIPLICAÇÃO (✖️).',
          visualSchema: 'repeat'
        }
      },
      {
        id: 'm3_p2',
        themeContext: 'Cartelas de Adesivos de Estrelas',
        statement: 'Para premiar os cadernos caprichados, foram distribuídas 5 cartelas de adesivos. Cada cartela possui 8 estrelinhas brilhantes.',
        question: 'Quantas estrelinhas há em todas as 5 cartelas juntas?',
        keywords: ['5 cartelas', 'cada cartela possui 8', 'todas juntas'],
        operation: '*',
        numbers: [5, 8],
        correctAnswer: 40,
        unit: 'estrelinhas',
        options: [40, 13, 35, 45],
        visual: {
          type: 'groups',
          total: 40,
          groups: 5,
          itemsPerGroup: 8,
          unitEmoji: '⭐',
        },
        explanation: {
          step1_interpret: 'São 5 grupos iguais de 8 estrelinhas cada um. Estamos multiplicando a quantidade de itens pelo número de cartelas.',
          step2_operation: 'Ideia de ADIÇÃO DE PARCELAS IGUAIS: usamos a MULTIPLICAÇÃO (✖️).',
          step3_calculation: 'Calculando: 5 vezes o 8 = 5 × 8 = 40 estrelinhas.',
          pedagogicalTip: 'Dica da Professora Simone: A tabuada do 5 sempre termina em 0 ou 5! Contando de 5 em 5 até o oitavo dedo: 5, 10, 15, 20, 25, 30, 35, 40!'
        },
        masterClue: {
          title: 'Dica de Mestre: Palavra Chave "Cada"!',
          interpretationClue: 'A palavra "cada" indica que todas as 5 cartelas têm a mesma quantia (8). Multiplicamos as 5 cartelas por 8 estrelas (5 × 8).',
          keywordHighlight: 'cada cartela possui 8 / todas juntas',
          operationHint: 'Repetir o número 8 por 5 vezes é calculado com a MULTIPLICAÇÃO (✖️).',
          visualSchema: 'repeat'
        }
      },
      {
        id: 'm3_p3',
        themeContext: 'Fileiras de Carteiras na Sala do 3° B',
        statement: 'Na sala do 3° Ano B, a Professora Simone organizou as carteiras em 6 fileiras. Em cada fileira, colocou 4 carteiras perfeitamente alinhadas.',
        question: 'Quantas carteiras há no total na sala de aula?',
        keywords: ['6 fileiras', 'em cada fileira 4 carteiras', 'organização retangular'],
        operation: '*',
        numbers: [6, 4],
        correctAnswer: 24,
        unit: 'carteiras',
        options: [24, 10, 20, 30],
        visual: {
          type: 'groups',
          total: 24,
          groups: 6,
          itemsPerGroup: 4,
          unitEmoji: '🪑',
        },
        explanation: {
          step1_interpret: 'Os objetos estão dispostos em fileiras e colunas (disposição retangular: 6 linhas de 4 carteiras).',
          step2_operation: 'A organização retangular é calculada com a MULTIPLICAÇÃO (✖️).',
          step3_calculation: 'Calculando: 6 fileiras × 4 carteiras = 24 carteiras ao todo.',
          pedagogicalTip: 'Dica da Professora Simone: Na multiplicação, a ordem não altera o produto: 6 × 4 = 24 e também 4 × 6 = 24!'
        },
        masterClue: {
          title: 'Dica de Mestre: Disposição Retangular!',
          interpretationClue: 'Fileiras e colunas organizadas como um tabuleiro! Temos 6 fileiras e 4 carteiras em cada fileira.',
          keywordHighlight: '6 fileiras / em cada fileira 4',
          operationHint: 'Contar objetos arrumados em linhas e colunas é feito multiplicando: 6 × 4!',
          visualSchema: 'repeat'
        }
      }
    ]
  },
  {
    id: 4,
    title: 'Missão 4: O Lanche Coletivo do 3° B',
    subtitle: 'Divisão ➗ (Repartir em Partes Iguais)',
    operation: '/',
    operationName: 'Divisão',
    operationConcept: 'Usamos a Divisão quando queremos REPARTIR uma quantidade igualmente entre amigos ou descobrir QUANTOS CABEM em cada grupo.',
    accentColor: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      badge: 'bg-indigo-100 text-indigo-800',
      text: 'text-indigo-700',
      gradient: 'from-indigo-500 to-purple-600',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    },
    iconName: 'Cake',
    themeBanner: 'Mesa de piquenique com sucos, biscoitos, cupcakes e pratos coloridos.',
    storyIntro: 'Chegou o momento mais esperado da 3ª aula de quinta-feira: o lanche coletivo! O desafio é dividir tudo de forma justa e igual entre todos.',
    problems: [
      {
        id: 'm4_p1',
        themeContext: 'Divisão dos Bombons de Chocolate',
        statement: 'Dona Simone levou uma caixa com 18 bombons deliciosos para a sala. Ela quer repartir esses bombons igualmente entre 3 mesas de alunos.',
        question: 'Quantos bombons cada mesa irá receber?',
        keywords: ['18 bombons', 'repartir igualmente', 'entre 3 mesas', 'cada mesa'],
        operation: '/',
        numbers: [18, 3],
        correctAnswer: 6,
        unit: 'bombons',
        options: [6, 15, 21, 5],
        visual: {
          type: 'sharing',
          total: 18,
          groups: 3,
          itemsPerGroup: 6,
          unitEmoji: '🍫',
        },
        explanation: {
          step1_interpret: 'A expressão "repartir igualmente" indica que a quantidade total (18) será distribuída em partes exatamente iguais para 3 grupos.',
          step2_operation: 'Ideia de REPARTIR EQUITATIVAMENTE: a operação necessária é a DIVISÃO (➗).',
          step3_calculation: 'Calculando: 18 dividido por 3 = 18 ÷ 3 = 6 bombons para cada mesa.',
          pedagogicalTip: 'Dica da Professora Simone: Para achar a divisão, pense na multiplicação inversa: Qual número vezes 3 dá 18? É o 6, pois 3 × 6 = 18!'
        },
        masterClue: {
          title: 'Dica de Mestre: Repartir Igualmente!',
          interpretationClue: 'A palavra mágica aqui é "repartir igualmente". O total de 18 bombons será distribuído sem sobrar nada para 3 mesas.',
          keywordHighlight: 'repartir igualmente / entre 3 mesas',
          operationHint: 'Distribuir uma quantia em partes iguais é a essência da DIVISÃO (➗).',
          visualSchema: 'share'
        }
      },
      {
        id: 'm4_p2',
        themeContext: 'Potes de Biscoitos Recheados',
        statement: 'A turma tem 20 biscoitos recheados e quer arrumá-los em potes transparentes. Em cada pote cabem exatamente 5 biscoitos.',
        question: 'De quantos potes a turma vai precisar para guardar todos os biscoitos?',
        keywords: ['20 biscoitos', 'em cada pote cabem 5', 'quantos potes', 'quantas vezes cabe'],
        operation: '/',
        numbers: [20, 5],
        correctAnswer: 4,
        unit: 'potes',
        options: [4, 15, 25, 6],
        visual: {
          type: 'sharing',
          total: 20,
          groups: 4,
          itemsPerGroup: 5,
          unitEmoji: '🍪',
        },
        explanation: {
          step1_interpret: 'Queremos descobrir quantos grupos de 5 cabem dentro de 20 biscoitos. Esta é a ideia de medida da divisão.',
          step2_operation: 'Para saber "quantos grupos cabem", usamos a DIVISÃO (➗).',
          step3_calculation: 'Calculando: 20 ÷ 5 = 4 potes.',
          pedagogicalTip: 'Dica da Professora Simone: Conte de 5 em 5 até chegar em 20: 5 (1 pote), 10 (2 potes), 15 (3 potes), 20 (4 potes)!'
        },
        masterClue: {
          title: 'Dica de Mestre: Quantas Vezes Cabe?',
          interpretationClue: 'Temos 20 biscoitos e queremos agrupar de 5 em 5. Queremos saber quantos potes serão preenchidos (quantas vezes 5 cabe em 20).',
          keywordHighlight: 'em cada pote cabem 5 / quantos potes',
          operationHint: 'Descobrir quantos grupos iguais podemos formar é a ideia de medida da DIVISÃO (➗).',
          visualSchema: 'share'
        }
      },
      {
        id: 'm4_p3',
        themeContext: 'Pratinhos de Mini Cupcakes',
        statement: 'Foram assados 24 mini cupcakes decorados com granulado. A turma combinou de colocar 4 cupcakes em cada pratinho da festa.',
        question: 'Quantos pratinhos completos serão formados?',
        keywords: ['24 mini cupcakes', '4 cupcakes em cada', 'quantos pratinhos formados'],
        operation: '/',
        numbers: [24, 4],
        correctAnswer: 6,
        unit: 'pratinhos',
        options: [6, 20, 28, 8],
        visual: {
          type: 'sharing',
          total: 24,
          groups: 6,
          itemsPerGroup: 4,
          unitEmoji: '🧁',
        },
        explanation: {
          step1_interpret: 'Temos 24 docinhos no total e estamos formando grupos com 4 unidades em cada um.',
          step2_operation: 'Ideia de agrupar em tamanhos iguais: usamos a DIVISÃO (➗).',
          step3_calculation: 'Calculando: 24 ÷ 4 = 6 pratinhos.',
          pedagogicalTip: 'Dica da Professora Simone: Conferindo pela tabuada do 4: 6 × 4 = 24. A conta deu exata e sem sobrar nenhum docinho!'
        },
        masterClue: {
          title: 'Dica de Mestre: Formar Pratinhos Iguais!',
          interpretationClue: 'O total é 24. Vamos separá-los em grupos de 4 docinhos por prato. Quantos pratos vamos conseguir encher?',
          keywordHighlight: '4 cupcakes em cada / quantos pratinhos',
          operationHint: 'Distribuir um total em porções iguais de 4 é feito com a DIVISÃO (➗).',
          visualSchema: 'share'
        }
      }
    ]
  }
];
