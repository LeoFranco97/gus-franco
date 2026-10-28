# Gus Franco | FRNCO

Site de fotografia do Gustavo Franco, montado a partir do conteúdo de
[gusfrn.co](https://gusfrn.co): 36 histórias completas e 1.979 fotografias,
nenhuma deixada de fora.

## Como rodar

```bash
npm install
npm run dev
```

`npm run build` gera `dist/`. Para publicar:

```bash
./scripts/publicar.sh
```

O script faz o build e empurra para o branch `gh-pages`, que e o que o
GitHub Pages serve. Nao e um GitHub Action porque o token local nao tem o
escopo `workflow`; para trocar um dia, `gh auth refresh -s workflow` e um
`.github/workflows/deploy.yml` comum.

No ar em <https://leofranco97.github.io/gus-franco/>.

## Estrutura

| Arquivo | O que é |
| --- | --- |
| `src/data/site.ts` | Todo o texto, a curadoria do hero e do marquee, e o `img()` que expande os caminhos das fotos |
| `src/data/stories-index.json` | Índice das 36 histórias: capa, prévia, lugar, data, grupo e contagem |
| `public/stories/<id>.json` | A lista completa de fotos de cada história, carregada só quando a história é aberta |
| `src/sections/` | Uma seção por bloco da página |
| `src/components/` | Muro do hero, lightbox, painel de história |

### As fotos

As imagens continuam sendo servidas pelo mesmo CDN que já hospeda o site
antigo (46graus). Isso deixa o repositório leve e usa o CDN deles, que já tem
as variações de tamanho prontas, mas **cria uma dependência**: se a
hospedagem do gusfrn.co for cancelada, as fotos somem daqui também.

Para hospedar as imagens no próprio repositório:

```bash
python3 scripts/mirror-photos.py --sizes mid thumb
```

O script baixa tudo para `public/photos` e reescreve os caminhos. As três
resoluções de todas as 1.979 fotos passam de vários GB, acima do que o GitHub
Pages comporta, então `--sizes mid thumb` é a opção prática.

### Trocar uma foto do hero

Editar `heroWall` em `src/data/site.ts`. Cada entrada tem o caminho, a
proporção real do arquivo (que é o que impede o layout de pular) e a legenda.

## O que ficou de fora

- A página `/galerias/elopement-and-travel/` do site antigo está vazia na
  origem, só tem a capa. A capa entrou em "Retratos & Viagens".
- Dois screenshots de tela que estavam na página de contato do site antigo.
  Não são fotografia.

## Pendências

- Domínio próprio (hoje roda no endereço do GitHub Pages).
- Decidir se as fotos ficam no CDN atual ou migram para o repositório.
- Revisar com o Gus os textos de serviços, que foram escritos a partir das
  palavras-chave do site antigo, não copiados dele.
