# Algoritmos de Caminho Mais Curto

Este repositório contém implementações dos algoritmos de Dijkstra e Bellman-Ford para encontrar o caminho mais curto em grafos.

## Algoritmo de Dijkstra

O algoritmo de Dijkstra é utilizado para encontrar o caminho mais curto de um vértice de origem para todos os outros vértices em um grafo com arestas de peso não negativo.

### Arquivo: `dijkstra.ts`

O arquivo `dijkstra.ts` contém a implementação do algoritmo de Dijkstra. Ele utiliza uma fila de prioridade para selecionar o próximo vértice a ser processado, garantindo que o caminho mais curto seja encontrado de forma eficiente.

## Algoritmo de Bellman-Ford

O algoritmo de Bellman-Ford é utilizado para encontrar o caminho mais curto em grafos que podem conter arestas com pesos negativos. Além disso, ele pode detectar ciclos de peso negativo no grafo.

### Arquivo: `bellman-ford.ts`

O arquivo `bellman-ford.ts` contém a implementação do algoritmo de Bellman-Ford. Ele itera sobre todas as arestas do grafo várias vezes para garantir que o caminho mais curto seja encontrado, mesmo na presença de arestas com pesos negativos.

## Como Executar

Para executar os algoritmos, siga as instruções abaixo:

1. Certifique-se de ter o Node.js instalado.
2. Navegue até o diretório do projeto.
3. Execute `npm install` para instalar as dependências.
4. Execute `ts-node dijkstra.ts` ou `ts-node bellman-ford.ts` para rodar os algoritmos.
