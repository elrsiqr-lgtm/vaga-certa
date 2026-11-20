# Vaga Certa (extensão Chrome, versão 0.1)

Etapa 1 do rascunho: cadastro de currículos + botão **Analisar vaga** (Gupy e Inhire) → currículo indicado, motivo e pretensão salarial.

## Instalar
1. `chrome://extensions` → ativar **Modo do desenvolvedor** → **Carregar sem compactação** → escolher esta pasta.
2. Clique no ícone → engrenagem → cadastre a chave da API do Claude e seus currículos (PDF).
3. Abra uma vaga na Gupy/Inhire → ícone → **Analisar vaga**.

## Notas
- Tudo fica em `chrome.storage.local`; o texto da vaga e os PDFs só saem do navegador ao clicar em Analisar, direto para `api.anthropic.com`.
- Pretensão salarial: usa a faixa escrita na vaga (piso = salário atual, se informado). Sem faixa, mostra "Sem dados suficientes". **A base do CAGED ainda não está integrada.**
- Etapas 2 (vale a pena?) e 3 (Minhas candidaturas) ficam para depois.
