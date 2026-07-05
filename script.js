// ==========================================
// CONFIGURAÇÃO DO FIREBASE (CLOUD SYNC)
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyDQsK2e2EoqrGKtwF9kNb-uMtlNUwXRNrE", 
    authDomain: "estudos-altos.firebaseapp.com",
    projectId: "estudos-altos",
    storageBucket: "estudos-altos.appspot.com",
    messagingSenderId: "509783168531",
    appId: "1:509783168531:web:2520f5da515312341f51e6" 
};

// Inicializa o Firebase se o SDK estiver presente
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var auth = firebase.auth();
    var db = firebase.firestore();
}

let currentUser = null;

// Parâmetros de Data do Edital
const DATA_PROVA = new Date("2026-08-30T00:00:00"); 
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

let LISTA_PDFS = [
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
    { id: 43, disciplina: "Tecnologia na Educação", titulo: "PDF 1 - Novas Tecnologias Aplicadas à Educação e Plataformas Virtuais.pdf", lido: false },
    { id: 44, disciplina: "Tecnologia na Educação", titulo: "PDF 2 - Novas Tecnologias Aplicadas II.pdf", lido: false },
    { id: 45, disciplina: "Tecnologia na Educação", titulo: "PDF 3 - Novas Tecnologias Aplicadas III.pdf", lido: false },
    { id: 46, disciplina: "Tecnologia na Educação", titulo: "PDF 4 - Educação à Distância I.pdf", lido: false },
    { id: 47, disciplina: "Tecnologia na Educação", titulo: "PDF 5 - Educação à Distância II.pdf", lido: false },
    { id: 48, disciplina: "Tecnologia na Educação", titulo: "PDF 6 - Educação à Distância III.pdf", lido: false },
    { id: 49, disciplina: "Tecnologia na Educação", titulo: "PDF 7 - Gamificação na educação.pdf", lido: false },
    { id: 50, disciplina: "Tecnologia na Educação", titulo: "PDF 8 - Utilização das Tecnologias de Informação I.pdf", lido: false }
];

// Estado de Memória Local Alternativo (Caso offline)
let dadosLocais = {
    questoesDia: {},
    historicoHoras: {},
    cadernoErros: [],
    resumos: [],
    pdfsLidos: []
};

// ==========================================
// MONITOR DE ESTADO DE AUTENTICAÇÃO (FIREBASE)
// ==========================================
if (typeof auth !== 'undefined') {
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            document.getElementById("user-info").innerText = `👤 Logado como: ${user.email}`;
            document.getElementById("auth-actions").style.display = "none";
            document.getElementById("auth-logged").style.display = "flex";
            document.getElementById("logged-email").innerText = user.email;
            puxarDadosNuvem();
        } else {
            currentUser = null;
            document.getElementById("user-info").innerText = "👤 Modo Offline (Progresso local ativo)";
            document.getElementById("auth-actions").style.display = "flex";
            document.getElementById("auth-logged").style.display = "none";
            carregarDadosLocaisSempre();
        }
    });
}

// Funções de Autenticação
function registrar() {
    const email = document.getElementById("auth-email").value;
    const senha = document.getElementById("auth-password").value;
    if (!email || !senha) return alert("Preencha email e senha!");
    
    auth.createUserWithEmailAndPassword(email, senha)
        .then(() => alert("Conta criada com sucesso!"))
        .catch(err => alert("Erro ao criar conta: " + err.message));
}

function login() {
    const email = document.getElementById("auth-email").value;
    const senha = document.getElementById("auth-password").value;
    if (!email || !senha) return alert("Preencha os campos de login!");
    
    auth.signInWithEmailAndPassword(email, senha)
        .then(() => alert("Login realizado!"))
        .catch(err => alert("Erro de autenticação: " + err.message));
}

function logout() {
    auth.signOut().then(() => {
        alert("Desconectado com sucesso.");
        location.reload();
    });
}

// ==========================================
// MOTORES DE NAVEGAÇÃO E REGRAS DE INTERFACE
// ==========================================
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active-content'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active-content');
    const btnActive = Array.from(document.querySelectorAll('.tab-btn')).find(btn => btn.getAttribute('onclick').includes(tabId));
    if (btnActive) btnActive.classList.add('active');
}

function popularDatas() {
    const select = document.getElementById("select-data");
    if(!select) return;
    select.innerHTML = "";
    
    let dataAtual = new Date(DATA_INICIO_ESTUDOS);
    while (dataAtual <= DATA_PROVA) {
        const option = document.createElement("option");
        const strData = dataAtual.toISOString().split('T')[0];
        
        const opcoesFormatacao = { day: '2-digit', month: '2-digit', weekday: 'short' };
        option.value = strData;
        option.innerText = `${dataAtual.toLocaleDateString('pt-BR', opcoesFormatacao)} - [Ref: ${strData}]`;
        select.appendChild(option);
        
        dataAtual.setDate(dataAtual.getDate() + 1);
    }
    // Seta o dia de hoje se existir no intervalo
    const hojeStr = new Date().toISOString().split('T')[0];
    if (Array.from(select.options).some(opt => opt.value === hojeStr)) {
        select.value = hojeStr;
    }
    mudarDataReal();
}

function mudarDataReal() {
    const dataSelecionada = document.getElementById("select-data").value;
    const dataObj = new Date(dataSelecionada + "T12:00:00");
    const diasDaSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const diaSemanaNome = diasDaSemana[dataObj.getDay()];
    
    // Atualiza Diretrizes de Fase baseado na distância da prova
    const hoje = new Date();
    const diferencaDias = Math.ceil((DATA_PROVA - hoje) / (1000 * 60 * 60 * 24));
    const containerDiretriz = document.getElementById("fase-diretriz");
    
    if (diferencaDias > 45) {
        containerDiretriz.innerHTML = `<h3>${fasesDaPreparacao.fase1.nome}</h3><p>${fasesDaPreparacao.fase1.diretriz}</p>`;
    } else if (diferencaDias <= 45 && diferencaDias > 15) {
        containerDiretriz.innerHTML = `<h3>${fasesDaPreparacao.fase2.nome}</h3><p>${fasesDaPreparacao.fase2.diretriz}</p>`;
    } else {
        containerDiretriz.innerHTML = `<h3>${fasesDaPreparacao.fase3.nome}</h3><p>${fasesDaPreparacao.fase3.diretriz}</p>`;
    }

    // Renderiza Cronograma Teórico Sugerido
    const divMaterias = document.getElementById("materias-do-dia");
    divMaterias.innerHTML = "";
    const materias = cicloMateriasBase[diaSemanaNome] || [];
    materias.forEach(mat => {
        const p = document.createElement("p");
        p.style.padding = "8px";
        p.style.background = "#f1f5f9";
        p.style.marginBottom = "5px";
        p.style.borderRadius = "4px";
        p.innerHTML = `🔹 ${mat}`;
        divMaterias.appendChild(p);
    });

    renderizarDesempenhoQuestoesDia(dataSelecionada);
    renderizarHistoricoTextoDia(dataSelecionada);
}

// ==========================================
// REGISTRO DE DESEMPENHO E HISTÓRICO DIÁRIO
// ==========================================
function salvarQuestoesDia(e) {
    e.preventDefault();
    const dataSel = document.getElementById("select-data").value;
    const disciplina = document.getElementById("qst-disciplina").value;
    const conteudo = document.getElementById("qst-conteudo").value;
    const acertos = parseInt(document.getElementById("qst-acertos").value) || 0;
    const erros = parseInt(document.getElementById("qst-erros").value) || 0;

    if(!dadosLocais.questoesDia[dataSel]) dadosLocais.questoesDia[dataSel] = [];
    
    dadosLocais.questoesDia[dataSel].push({ disciplina, conteudo, acertos, erros });
    salvarDadosFinais();
    renderizarDesempenhoQuestoesDia(dataSel);
    document.getElementById("form-questoes-dia").reset();
}

function renderizarDesempenhoQuestoesDia(dataSel) {
    const container = document.getElementById("lista-questoes-do-dia");
    container.innerHTML = "";
    const lista = dadosLocais.questoesDia[dataSel] || [];
    
    lista.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "item-salvo";
        const total = item.acertos + item.erros;
        const porc = total > 0 ? ((item.acertos / total) * 100).toFixed(0) : 0;
        
        div.innerHTML = `
            <strong>${item.disciplina}</strong> - ${item.conteudo}<br>
            <span style="color:green">📈 Acertos: ${item.acertos}</span> | <span style="color:red">📉 Erros: ${item.erros}</span> (Aproveitamento: ${porc}%)
            <button onclick="removerQuestaoDia('${dataSel}', ${index})" style="position:absolute; right:10px; top:10px; background:none; border:none; color:red; cursor:pointer;">❌</button>
        `;
        container.appendChild(div);
    });
    atualizarEstatisticaGeralErros();
}

function removerQuestaoDia(dataSel, index) {
    dadosLocais.questoesDia[dataSel].splice(index, 1);
    salvarDadosFinais();
    renderizarDesempenhoQuestoesDia(dataSel);
}

// Histórico de Execução Realizada
document.getElementById("form-registro-dia").onsubmit = function(e) {
    e.preventDefault();
    const dataSel = document.getElementById("select-data").value;
    const horas = document.getElementById("registro-horas").value;
    const texto = document.getElementById("registro-texto").value;

    dadosLocais.historicoHoras[dataSel] = { horas, texto };
    salvarDadosFinais();
    renderizarHistoricoTextoDia(dataSel);
    
    const feedback = document.getElementById("status-dia-salvo");
    feedback.style.display = "block";
    feedback.style.background = "#d4edda";
    feedback.style.color = "#155724";
    feedback.innerText = "Histórico do dia gravado com sucesso!";
    setTimeout(() => feedback.style.display="none", 3000);
};

function renderizarHistoricoTextoDia(dataSel) {
    const registro = dadosLocais.historicoHoras[dataSel];
    if(registro) {
        document.getElementById("registro-horas").value = registro.horas;
        document.getElementById("registro-texto").value = registro.texto;
    } else {
        document.getElementById("registro-horas").value = "";
        document.getElementById("registro-texto").value = "";
    }
}

// ==========================================
// CADERNO DE ERROS POR DISCIPLINA
// ==========================================
document.getElementById("form-erro").onsubmit = function(e) {
    e.preventDefault();
    const disciplina = document.getElementById("erro-disciplina").value;
    const enunciado = document.getElementById("erro-enunciado").value;
    const motivo = document.getElementById("erro-motivo").value;

    dadosLocais.cadernoErros.push({ disciplina, enunciado, motivo });
    salvarDadosFinais();
    renderizarCadernoErros();
    this.reset();
};

function renderizarCadernoErros() {
    const disciplinas = ["Matemática", "Língua Portuguesa", "Raciocínio Lógico", "Informática", "Conhecimentos Pedagógicos", "Legislação"];
    
    disciplinas.forEach(disc => {
        const container = document.getElementById(`lista-erros-${disc}`);
        if(!container) return;
        container.innerHTML = "";
        
        const errosFiltrados = dadosLocais.cadernoErros.filter(e => e.disciplina === disc);
        errosFiltrados.forEach((item, originalIndex) => {
            const div = document.createElement("div");
            div.className = "item-salvo";
            div.innerHTML = `
                <strong>Tópico/Enunciado:</strong> ${item.enunciado}<br>
                <strong>Pegadinha/Correção:</strong> <span style="color:#b71c1c">${item.motivo}</span>
                <button onclick="removerErro(${originalIndex})" style="position:absolute; right:10px; top:10px; background:none; border:none; color:red; cursor:pointer;">❌</button>
            `;
            container.appendChild(div);
        });
    });
    atualizarEstatisticaGeralErros();
}

function removerErro(indexGlobal) {
    dadosLocais.cadernoErros.splice(indexGlobal, 1);
    salvarDadosFinais();
    renderizarCadernoErros();
}

function atualizarEstatisticaGeralErros() {
    const disciplinas = ["Matemática", "Língua Portuguesa", "Raciocínio Lógico", "Informática", "Conhecimentos Pedagógicos", "Legislação"];
    
    disciplinas.forEach(disc => {
        const painel = document.getElementById(`estatistica-${disc}`);
        if(!painel) return;
        
        let totalAcertos = 0;
        let totalErros = 0;
        
        Object.values(dadosLocais.questoesDia).forEach(diaArray => {
            diaArray.forEach(q => {
                if(q.disciplina === disc) {
                    totalAcertos += q.acertos;
                    totalErros += q.erros;
                }
            });
        });
        
        const total = totalAcertos + totalErros;
        const porc = total > 0 ? ((totalAcertos / total) * 100).toFixed(0) : 0;
        painel.innerHTML = `<span>Acumulado: ${total} Qs Solucionadas</span> <span>Aproveitamento: ${porc}%</span>`;
    });
}

// ==========================================
// MEUS RESUMOS E EDITOR DE TEXTO
// ==========================================
document.getElementById("form-mapa").onsubmit = function(e) {
    e.preventDefault();
    const disciplina = document.getElementById("mapa-disciplina").value;
    const titulo = document.getElementById("mapa-titulo").value;
    const editorDom = document.getElementById("mapa-conteudo-editor");
    
    const conteudoHtml = editorDom.innerHTML;
    if(!conteudoHtml.trim() || conteudoHtml === "<br>") return alert("Escreva um conteúdo para salvar!");

    dadosLocais.resumos.push({ disciplina, titulo, conteudo: conteudoHtml });
    salvarDadosFinais();
    renderizarResumos();
    
    document.getElementById("mapa-titulo").value = "";
    editorDom.innerHTML = "";
};

function renderizarResumos() {
    const disciplinas = ["Matemática", "Língua Portuguesa", "Raciocínio Lógico", "Informática", "Conhecimentos Pedagógicos", "Legislação"];
    disciplinas.forEach(disc => {
        const container = document.getElementById(`lista-mapas-${disc}`);
        if(!container) return;
        container.innerHTML = "";
        
        dadosLocais.resumos.forEach((item, index) => {
            if(item.disciplina !== disc) return;
            const div = document.createElement("div");
            div.className = "item-salvo";
            div.innerHTML = `
                <h4 style="color:var(--primary); margin-bottom:8px;">📝 ${item.titulo}</h4>
                <div style="background: #fff; padding:10px; border-radius:4px; border:1px solid #e2e8f0;">${item.conteudo}</div>
                <button onclick="removerResumo(${index})" style="position:absolute; right:10px; top:10px; background:none; border:none; color:red; cursor:pointer;">❌</button>
            `;
            container.appendChild(div);
        });
    });
}

function removerResumo(index) {
    dadosLocais.resumos.splice(index, 1);
    salvarDadosFinais();
    renderizarResumos();
}

// Toolbar interativa do editor
document.getElementById("editor-font-size").onchange = function() {
    document.getElementById("mapa-conteudo-editor").style.fontSize = this.value;
};
document.getElementById("editor-font-color").onchange = function() {
    document.getElementById("mapa-conteudo-editor").style.color = this.value;
};

// ==========================================
// SISTEMA DE CONTROLE DE PDFs E EDITAL
// ==========================================
document.getElementById("form-pdf").onsubmit = function(e) {
    e.preventDefault();
    const disciplina = document.getElementById("pdf-disciplina").value;
    const titulo = document.getElementById("pdf-titulo").value;
    
    const novoId = LISTA_PDFS.length > 0 ? Math.max(...LISTA_PDFS.map(p => p.id)) + 1 : 1;
    LISTA_PDFS.push({ id: novoId, disciplina, titulo, lido: false });
    
    carregarPDFs();
    this.reset();
};

function carregarPDFs() {
    const filtro = document.getElementById("filtro-disciplina-pdf").value;
    const container = document.getElementById("lista-pdfs");
    if(!container) return;
    container.innerHTML = "";

    LISTA_PDFS.forEach(pdf => {
        if(filtro !== "TODOS" && pdf.disciplina !== filtro) return;
        
        const isLido = dadosLocais.pdfsLidos.includes(pdf.id);
        const div = document.createElement("div");
        div.className = "pdf-item";
        div.innerHTML = `
            <div class="pdf-info">
                <input type="checkbox" ${isLido ? 'checked' : ''} onchange="togglePdfLido(${pdf.id}, this.checked)">
                <span class="pdf-texto ${isLido ? 'lido' : ''}">[${pdf.disciplina}] ${pdf.titulo}</span>
            </div>
            <button onclick="removerPdfBase(${pdf.id})" style="background:none; border:none; color:#ccc; cursor:pointer;">❌</button>
        `;
        container.appendChild(div);
    });
    calcularProgressoGeralPDF();
}

function togglePdfLido(id, checked) {
    if(checked) {
        if(!dadosLocais.pdfsLidos.includes(id)) dadosLocais.pdfsLidos.push(id);
    } else {
        dadosLocais.pdfsLidos = dadosLocais.pdfsLidos.filter(pId => pId !== id);
    }
    salvarDadosFinais();
    carregarPDFs();
}

function removerPdfBase(id) {
    LISTA_PDFS = LISTA_PDFS.filter(p => p.id !== id);
    dadosLocais.pdfsLidos = dadosLocais.pdfsLidos.filter(pId => pId !== id);
    salvarDadosFinais();
    carregarPDFs();
}

function calcularProgressoGeralPDF() {
    const totalPdfs = LISTA_PDFS.length;
    const lidos = LISTA_PDFS.filter(p => dadosLocais.pdfsLidos.includes(p.id)).length;
    const porcentagemGlobal = totalPdfs > 0 ? Math.round((lidos / totalPdfs) * 100) : 0;
    
    document.getElementById("porcentagem-global-pdf").innerText = `${porcentagemGlobal}%`;
    document.getElementById("barra-global-pdf-fill").style.width = `${porcentagemGlobal}%`;

    // Atualiza mini cards analíticos das disciplinas
    const disciplinasLista = [
        { chave: "Matemática", idPorc: "porc-card-Matemática", idCont: "cont-card-Matemática" },
        { chave: "Língua Portuguesa", idPorc: "porc-card-Portugues", idCont: "cont-card-Portugues" },
        { chave: "Raciocínio Lógico", idPorc: "porc-card-RLM", idCont: "cont-card-RLM" },
        { chave: "Conhecimentos Pedagógicos", idPorc: "porc-card-Pedagogicos", idCont: "cont-card-Pedagogicos" },
        { chave: "Tecnologia na Educação", idPorc: "porc-card-Tecnologia", idCont: "cont-card-Tecnologia" }
    ];

    disciplinasLista.forEach(d => {
        const totalD = LISTA_PDFS.filter(p => p.disciplina === d.chave).length;
        const lidosD = LISTA_PDFS.filter(p => p.disciplina === d.chave && dadosLocais.pdfsLidos.includes(p.id)).length;
        const porcD = totalD > 0 ? Math.round((lidosD / totalD) * 100) : 0;
        
        const pDom = document.getElementById(d.idPorc);
        const cDom = document.getElementById(d.idCont);
        if(pDom) pDom.innerText = `${porcD}%`;
        if(cDom) cDom.innerText = `${lidosD} de ${totalD} lidos`;
    });

    // Ritmo de Leitura Estimado até a Prova
    const hoje = new Date();
    const diasRestantes = Math.ceil((DATA_PROVA - hoje) / (1000 * 60 * 60 * 24));
    const naoLidos = totalPdfs - lidos;
    const ritmoContainer = document.getElementById("feedback-ritmo-leitura");

    if (ritmoContainer) {
        if (naoLidos <= 0) {
            ritmoContainer.style.background = "#d4edda";
            ritmoContainer.style.color = "#155724";
            ritmoContainer.innerHTML = "🎉 Edital líquido e lido por completo! Concentre-se nas revisões!";
        } else if (diasRestantes <= 0) {
            ritmoContainer.style.background = "#f8d7da";
            ritmoContainer.style.color = "#721c24";
            ritmoContainer.innerHTML = "🚨 Dia da prova atingido!";
        } else {
            const metaRitmo = (naoLidos / diasRestantes).toFixed(2);
            ritmoContainer.style.background = "#fff3cd";
            ritmoContainer.style.color = "#856404";
            ritmoContainer.innerHTML = `📈 Ritmo Necessário: Você precisa ler aproximadamente <strong>${metaRitmo} PDF(s) por dia</strong> para esgotar o edital a tempo.`;
        }
    }
}

// ==========================================
// PERSISTÊNCIA LOCAL E EM NUVEM (FIRESTORE)
// ==========================================
function salvarDadosFinais() {
    // 1. Salva no LocalStorage para contingência offline immediate
    localStorage.setItem("foco_altos_data", JSON.stringify(dadosLocais));
    localStorage.setItem("foco_altos_base_pdfs", JSON.stringify(LISTA_PDFS));

    // 2. Sincroniza assincronamente com o Firestore se usuário estiver logado
    if (currentUser && typeof db !== 'undefined') {
        document.getElementById("sync-status").innerText = "🔄 Sincronizando...";
        document.getElementById("sync-status").style.background = "#ffb703";
        
        db.collection("usuarios").doc(currentUser.uid).set({
            dadosLocais: dadosLocais,
            listaPdfsBase: LISTA_PDFS,
            ultimaAtualizacao: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            document.getElementById("sync-status").innerText = "🟢 Sincronizado";
            document.getElementById("sync-status").style.background = "#2ec4b6";
        })
        .catch(err => {
            console.error("Erro na sincronização em nuvem: ", err);
            document.getElementById("sync-status").innerText = "🔴 Erro na Nuvem";
            document.getElementById("sync-status").style.background = "#e63946";
        });
    }
}

function carregarDadosLocaisSempre() {
    const backupLocal = localStorage.getItem("foco_altos_data");
    const pdfsLocais = localStorage.getItem("foco_altos_base_pdfs");
    
    if (backupLocal) dadosLocais = JSON.parse(backupLocal);
    if (pdfsLocais) LISTA_PDFS = JSON.parse(pdfsLocais);
    
    // Normaliza estruturas caso vazias
    if(!dadosLocais.questoesDia) dadosLocais.questoesDia = {};
    if(!dadosLocais.historicoHoras) dadosLocais.historicoHoras = {};
    if(!dadosLocais.cadernoErros) dadosLocais.cadernoErros = [];
    if(!dadosLocais.resumos) dadosLocais.resumos = [];
    if(!dadosLocais.pdfsLidos) dadosLocais.pdfsLidos = [];

    // Renderiza telas
    popularDatas();
    renderizarCadernoErros();
    renderizarResumos();
    carregarPDFs();
}

function puxarDadosNuvem() {
    if (!currentUser || typeof db === 'undefined') return;
    
    db.collection("usuarios").doc(currentUser.uid).get()
        .then(doc => {
            if (doc.exists) {
                const nuvem = doc.data();
                if(nuvem.dadosLocais) dadosLocais = nuvem.dadosLocais;
                if(nuvem.listaPdfsBase) LISTA_PDFS = nuvem.listaPdfsBase;
                
                // Grava localmente para estabilizar
                localStorage.setItem("foco_altos_data", JSON.stringify(dadosLocais));
                localStorage.setItem("foco_altos_base_pdfs", JSON.stringify(LISTA_PDFS));
            }
            carregarDadosLocaisSempre();
        })
        .catch(err => {
            console.error("Erro ao ler da nuvem, usando local padrão: ", err);
            carregarDadosLocaisSempre();
        });
}

// ==========================================
// IMPORTAÇÃO / EXPORTAÇÃO MANUAL DE BACKUP JSON
// ==========================================
function exportarDados() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({dadosLocais, LISTA_PDFS}));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backup_painel_altos_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importarDados(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importado = JSON.parse(e.target.result);
            if (importado.dadosLocais && importado.LISTA_PDFS) {
                dadosLocais = importado.dadosLocais;
                LISTA_PDFS = importado.LISTA_PDFS;
                salvarDadosFinais();
                carregarDadosLocaisSempre();
                alert("Backup manual importado e processado com sucesso!");
            } else {
                alert("Formato de arquivo JSON de backup inválido.");
            }
        } catch (err) {
            alert("Erro na leitura do arquivo JSON.");
        }
    };
    reader.readAsText(arquivo);
}

// Execução imediata ao carregar página
window.onload = function() {
    carregarDadosLocaisSempre();
};