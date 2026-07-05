// ==========================================
// CONFIGURAÇÃO DO FIREBASE (CLOUD SYNC)
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyDQsK2e2EoqrGKtwF9kNb-uMtlNUwXRNrE", // <--- Substitua aqui com a API Key real encontrada ao clicar em "Config"
    authDomain: "estudos-altos.firebaseapp.com",
    projectId: "estudos-altos",
    storageBucket: "estudos-altos.appspot.com",
    messagingSenderId: "509783168531",
    appId: "1:509783168531:web:2520f5da515312341f51e6" // Seu App ID real já preenchido!
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

// Data real da prova estabelecida pelo Edital de Altos-PI
const DATA_PROVA = new Date("2026-08-30T00:00:00"); 

// Dia exato em que você começou seus estudos
const DATA_INICIO_ESTUDOS = new Date("2026-06-22T00:00:00");

const fasesDaPreparacao = {
    fase1: {
        nome: "Fase 1: Construção de Base e Blindagem",
        diretriz: "🎯 <strong>Foco:</strong> Estudo teórico minucioso do edital + Criação activa de resumos e preenchimento inicial do caderno de erros por matéria. Não avance sem consolidar as fórmulas de Álgebra!"
    },
    fase2: {
        nome: "Fase 2: Engenharia Reversa e Massificação (Reta Intermediária)",
        diretriz: "🔄 <strong>Foco:</strong> 80% Resolução de Questões da IGEDUC direto no caderno de erros. Use a teoria pontualmente apenas para sanar falhas repetitivas e revisar pegadinhas estruturais."
    },
    fase3: {
        nome: "Fase 3: Reta Final e Simulação Extrema (Últimos 15 dias)",
        diretriz: "🏁 <strong>Foco:</strong> Revisar exclusivamente seu Caderno de Erros acumulado, ler leis secas municipais e fixar fórmulas-chave de Geometria Plana/Espacial."
    }
};

const cicloMateriasBase = {
    "Segunda-feira": ["Matemática Específica: Álgebra (Monômios, Polinômios, Fatoração e Sistemas Lineares)", "Língua Portuguesa: Compreensão de Texto e Tipologia Textual", "Legislação: Regime Jurídico Único dos Servidores de Altos"],
    "Terça-feira": ["Matemática Específica: Conjuntos Numéricos e Funções (1º e 2º Grau)", "Conhecimentos Pedagógicos: Teorias de Aprendizagem (Piaget, Vygotsky, Wallon)", "Raciocínio Lógico: Proposições e Conectivos Lógicos"],
    "Quarta-feira": ["Matemática Específica: Progressões (PA e PG) e Análise Combinatória", "Língua Portuguesa: Sintaxe (Regência, Concordância e Crase)", "Legislação: Lei Orgânica do Município de Altos"],
    "Quinta-feira": ["Matemática Específica: Geometria Plana e Espacial (Áreas e Volumes)", "Conhecimentos Pedagógicos: Didática Geral e Libâneo", "Raciocínio Lógico: Equivalências e Negações Lógicas"],
    "Sexta-feira": ["Matemática Específica: Estatística, Probabilidade e Análise de Gráficos", "Língua Portuguesa: Semântica e Figuras de Linguagem", "Legislação: Constitution Federal (Artigos Relacionados à Educação)"],
    "Sábado": ["Matemática Específica: Trigonometria na Circunferência e Matrizes", "Conhecimentos Pedagógicos: Avaliação Escolar (Jussara Hoffmann e Cipriano Luckesi)", "Simulado Rápido: Resolução de 20 questões aleatórias da banca IGEDUC"],
    "Domingo": ["🚨 Dia de Simulado Geral Completo: Cronometre 3 horas simulando o ambiente real da prova.", "Revisão e Correção Analítica: Alimente seu Caderno de Erros com tudo o que escorregar no simulado de hoje!"]
};

// BANCO DE DADOS INICIAL DO SEU EDITAL
const LISTA_PDFS_PADRAO = [
    { id: 1, disciplina: "Matemática", titulo: "PDF 1 - Números.pdf", lido: false },
    { id: 2, disciplina: "Matemática", titulo: "PDF 2 - Razão, Proporção e Porcentagem.pdf", lido: false },
    { id: 3, disciplina: "Matemática", titulo: "PDF 3 - Juros Simples.pdf", lido: false },
    { id: 4, disciplina: "Matemática", titulo: "PDF 4 - Juros Compostos.pdf", lido: false },
    { id: 5, disciplina: "Matemática", titulo: "PDF 5 - Funções.pdf", lido: false },
    { id: 6, disciplina: "Matemática", titulo: "PDF 6 - Inequações.pdf", lido: false },
    { id: 7, disciplina: "Matemática", titulo: "PDF 7 - Progressões Aritméticas e Geométricas.pdf", lido: false },
    { id: 8, disciplina: "Matemática", titulo: "PDF 8 - Geometria Plana.pdf", lido: false },
    { id: 9, disciplina: "Matemática", titulo: "PDF 9 - Geometria Espacial.pdf", lido: false },
    { id: 10, disciplina: "Matemática", titulo: "PDF 10 - Estruturas Lógicas.pdf", lido: false },
    { id: 11, disciplina: "Matemática", titulo: "PDF 11 - Trigonometria.pdf", lido: false },
    { id: 12, disciplina: "Matemática", titulo: "PDF 12 - Análise Combinatória.pdf", lido: false },
    { id: 13, disciplina: "Matemática", titulo: "PDF 13 - Probabilidade.pdf", lido: false },
    { id: 14, disciplina: "Matemática", titulo: "PDF 14 - Noções de Estatística.pdf", lido: false },
    { id: 15, disciplina: "Conhecimentos Pedagógicos", titulo: "PDF 1 - Andragogia e Avaliação.pdf", lido: false },
    { id: 16, disciplina: "Conhecimentos Pedagógicos", titulo: "PDF 2 - Currículo.pdf", lido: false },
    { id: 17, disciplina: "Conhecimentos Pedagógicos", titulo: "PDF 3 - Didáticas, Coordenação, Compromisso Social e Ético do Professor.pdf", lido: false },
    { id: 18, disciplina: "Conhecimentos Pedagógicos", titulo: "PDF 4 - Gestão Democrática.pdf", lido: false },
    { id: 19, disciplina: "Conhecimentos Pedagógicos", titulo: "PDF 5 - Legislação Educacional - Parte I.pdf", lido: false },
    { id: 20, disciplina: "Conhecimentos Pedagógicos", titulo: "PDF 6 - Legislação Educacional - Parte II.pdf", lido: false },
    { id: 21, disciplina: "Conhecimentos Pedagógicos", titulo: "PDF 7 - Legislação Educacional - Parte III.pdf", lido: false },
    { id: 22, disciplina: "Conhecimentos Pedagógicos", titulo: "PDF 8 - Legislação Educacional - Parte IV.pdf", lido: false },
    { id: 23, disciplina: "Conhecimentos Pedagógicos", titulo: "PDF 9 - Legislação Educacional - Parte V.pdf", lido: false },
    { id: 24, disciplina: "Conhecimentos Pedagógicos", titulo: "PDF 10 - Projeto Político-Pedagógico da Escola.pdf", lido: false },
    { id: 25, disciplina: "Conhecimentos Pedagógicos", titulo: "PDF 11 - Tendências Pedagógicas - Parte I.pdf", lido: false },
    { id: 26, disciplina: "Conhecimentos Pedagógicos", titulo: "PDF 12 - Tendências Pedagógicas - Parte II.pdf", lido: false },
    { id: 27, disciplina: "Conhecimentos Pedagógicos", titulo: "PDF 13 - Teorias da Aprendizagem e Processos Cognitivos.pdf", lido: false },
    { id: 28, disciplina: "Língua Portuguesa", titulo: "PDF 1 - Compreensão e Interpretação de Textos.pdf", lido: false },
    { id: 29, disciplina: "Língua Portuguesa", titulo: "PDF 2 - Tipologias e Gêneros Textuais.pdf", lido: false },
    { id: 30, disciplina: "Língua Portuguesa", titulo: "PDF 3 - Coesão e Coerência, Semântica, Figuras e Vícios de Linguagem, Reescrita.pdf", lido: false },
    { id: 31, disciplina: "Língua Portuguesa", titulo: "PDF 1 - Noções de Fonética, Acentuação Gráfica e Ortografia Oficial.pdf", lido: false },
    { id: 32, disciplina: "Língua Portuguesa", titulo: "PDF 2 - Emprego e Sentido das Classes Gramaticais - Parte I.pdf", lido: false },
    { id: 33, disciplina: "Língua Portuguesa", titulo: "PDF 3 - Emprego e Sentido das Classes Gramaticais - Parte II.pdf", lido: false },
    { id: 34, disciplina: "Língua Portuguesa", titulo: "PDF 4 - A Sintaxe do Período Simples - Parte I.pdf", lido: false },
    { id: 35, disciplina: "Língua Portuguesa", titulo: "PDF 5 - A Sintaxe do Período Simples - Parte II.pdf", lido: false },
    { id: 36, disciplina: "Língua Portuguesa", titulo: "PDF 6 - A Sintaxe do Período Composto.pdf", lido: false },
    { id: 37, disciplina: "Língua Portuguesa", titulo: "PDF 7 - Concordância, Regência, Colocação, Crase e Pontuação.pdf", lido: false },
    { id: 38, disciplina: "Raciocínio Lógico", titulo: "PDF 1 - Análise Combinatória.pdf", lido: false },
    { id: 39, disciplina: "Raciocínio Lógico", titulo: "PDF 2 - Lógica de Argumentação.pdf", lido: false },
    { id: 40, disciplina: "Raciocínio Lógico", titulo: "PDF 3 - Diagramas Lógicos.pdf", lido: false },
    { id: 41, disciplina: "Raciocínio Lógico", titulo: "PDF 4 - Operador Condicional.pdf", lido: false },
    { id: 42, disciplina: "Raciocínio Lógico", titulo: "PDF 5 - Operadores Lógicos Fundamentais.pdf", lido: false },
    { id: 43, disciplina: "Tecnologia na Educação", titulo: "PDF 1 - Novas Tecnologias Aplicadas à Educação e Plataformas de Aprendizagem Virtuais e Avaliação Educacional.pdf", lido: false },
    { id: 44, disciplina: "Tecnologia na Educação", titulo: "PDF 2 - Novas Tecnologias Aplicadas... II.pdf", lido: false },
    { id: 45, disciplina: "Tecnologia na Educação", titulo: "PDF 3 - Novas Tecnologias Aplicadas... III.pdf", lido: false },
    { id: 46, disciplina: "Tecnologia na Educação", titulo: "PDF 1 - Educação à Distância.pdf", lido: false },
    { id: 47, disciplina: "Tecnologia na Educação", titulo: "PDF 2 - Educação à Distância II.pdf", lido: false },
    { id: 48, disciplina: "Tecnologia na Educação", titulo: "PDF 3 - Educação à Distância III.pdf", lido: false },
    { id: 49, disciplina: "Tecnologia na Educação", titulo: "PDF 1 - Gamificação na educação III.pdf", lido: false },
    { id: 50, disciplina: "Tecnologia na Educação", titulo: "PDF 1 - Utilização das Tecnologias de Informação... I.pdf", lido: false },
    { id: Sem resposta
