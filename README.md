# Gerador de Termo de Garantia – Assistência Técnica (Potim / Roseira)

Aplicação desenvolvida para emissão de Termos de Garantia com respaldo jurídico (CDC Art. 26), suporte a assinaturas digitais na tela (touch / mouse), anexo de fotos de evidências e geração de PDF formatado em folha A4.

---

## 🚀 Opção 1: Uso Imediato (Sem Instalar Nada)

Você pode abrir diretamente o arquivo **[`termo_garantia.html`](file:///c:/dev/termo_garantia/termo_garantia.html)** no navegador:
1. Localize o arquivo `termo_garantia.html` na pasta do projeto.
2. Dê um duplo clique nele (ou abra com Google Chrome / Microsoft Edge).
3. Pronto! Funciona no PC, notebook, tablet ou celular na loja.

---

## 💻 Opção 2: Projeto Vite + React (SPA Completa)

O projeto React já está configurado e com as dependências instaladas nesta pasta.

### Comandos disponíveis:

- **Iniciar servidor de desenvolvimento:**
  ```bash
  npm run dev
  ```
- **Gerar versão de produção otimizada:**
  ```bash
  npm run build
  ```
- **Visualizar prévia da build:**
  ```bash
  npm run preview
  ```

---

## 🛠️ Recursos Inclusos

- **Formulário Dinâmico:** OS, Cliente, Aparelho, IMEI, Data de Serviço, Data de Emissão, Serviço e Cidade (Potim / Roseira).
- **Pré-visualização em Tempo Real:** Atualização instantânea do termo conforme digitação.
- **Assinatura Touch:** Campos de assinatura para o Cliente e para o Técnico/Loja com botão de limpar.
- **Anexo Fotográfico:** Upload de múltiplas fotos de evidência com miniatura e exibição automática no anexo do termo.
- **Exportação em PDF:** Geração automática em padrão A4 via `jsPDF` e `html2canvas` com nome padronizado (`Garantia_OS-XXXX_NomeCliente.pdf`).
- **Texto Jurídico Seguro:** Cobertura de 90 dias (CDC Art. 26), exclusões claras de garantia (quedas, umidade, mau uso, abertura por terceiros) e prazo de 30 dias para laudo.
