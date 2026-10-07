# Nuve Studios — site

Abra o `index.html` no navegador (precisa de internet para as fontes e o Three.js).

## Onde mexer

| Quero mudar...                  | Arquivo                |
| ------------------------------- | ---------------------- |
| **Cores, fontes, cor da nuvem 3D** | `css/cores.css`     |
| Topo e menu do celular          | `css/header.css`       |
| Primeira tela (hero)            | `css/hero.css`         |
| Faixa azul que rola             | `css/faixa.css`        |
| Serviços (cards)                | `css/servicos.css`     |
| Processo (etapas)               | `css/processo.css`     |
| Dúvidas frequentes              | `css/faq.css`          |
| Chamado final                   | `css/chamado-final.css`|
| Rodapé                          | `css/rodape.css`       |
| Página de erro 404 (com nuvem 3D) | `404.html` + `css/erro-404.css` |
| Página de projetos (visual)     | `projetos.html` + `css/projetos.css` |
| **Lista de projetos (adicionar/remover)** | `js/projetos-dados.js` + imagens em `assets/projetos/` |
| Botão flutuante do WhatsApp (celular) | `css/whatsapp.css` |
| Botões, títulos, espaçamentos   | `css/base.css`         |
| Textos do site                  | `index.html` (cada seção tem um comentário `<!-- ===== NOME ===== -->`) |
| Tamanho, giro e luz da nuvem 3D | `js/nuvem-3d.js` (bloco `CFG` no começo) |
| Entrada da nuvem (fade + zoom)  | final de `css/hero.css` |
| Quando o 3D carrega             | `js/carregar-3d.js` (carrega depois do texto) |

## Testar uma paleta nova
Em `css/cores.css`, troque os valores. A nuvem 3D e o ícone do logo acompanham
(`--nuvem-frente`, `--nuvem-lateral`, `--azul-claro`).
O tema escuro (para quem usa o celular em modo escuro) está no fim do mesmo arquivo.

## Outras pastas
- `assets/modelos-3d/`: nuvem em .glb, .obj e .stl
- `assets/marca/`: logo original (.ai e .pdf)
- `js/dados-logo.js`: pontos do contorno da nuvem (não precisa mexer)

## Publicar
Arraste a pasta inteira para a Vercel (ou outro host de site estático).

## Trocar o número do WhatsApp
No `index.html`, procure por `5579991488085` (aparece em 6 links) e troque pelo novo número, no formato 55 + DDD + número.
O texto "(79) 99148-8085" do rodapé também precisa ser trocado.

## Antes de publicar (busca e prévia do link)
Em `index.html` e `projetos.html`, troque **SEU-DOMINIO** pelo endereço real do site (use Buscar e Substituir no editor; aparece no começo de cada arquivo).
Sem isso a imagem de prévia não aparece quando o link é enviado no WhatsApp ou Instagram.
A cidade (Aracaju - SE) já está nos dados do Google.
A imagem da prévia é `assets/preview-link.png` (1200x630).

## Página 404
O `404.html` aparece sozinho na Vercel e na Netlify quando alguém abre um endereço que não existe. Não precisa configurar nada.

## Adicionar um projeto na página Projetos
1. Coloque a imagem em `assets/projetos/` (ideal: 1080 x 1350 px, menos de 500 KB).
2. Abra `js/projetos-dados.js`, copie o bloco de exemplo e preencha: nome, categoria (`posts`, `pos-producao` ou `direcao-de-arte`), imagem, descrição e ano.
3. Os filtros aparecem sozinhos. Enquanto a lista estiver vazia, a página mostra "Em breve".
4. Quando adicionar o primeiro projeto, em `projetos.html` troque `noindex` por `index, follow` (para o Google listar a página).
