import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';

interface Graph {
    [node: string]: { [neighbor: string]: number };
}

const dijkstra = (graph: Graph, startNode: string): { distances: { [node: string]: number }, previousNodes: { [node: string]: string | null } } => {
    const distances: { [node: string]: number } = {};
    const previousNodes: { [node: string]: string | null } = {};
    const unvisitedNodes = new Set<string>(Object.keys(graph));

    for (const node in graph) {
        distances[node] = Infinity;
    }
    distances[startNode] = 0;

    while (unvisitedNodes.size > 0) {
        let currentNode: string | null = null;
        for (const node of unvisitedNodes) {
            if (currentNode === null || distances[node] < distances[currentNode]) {
                currentNode = node;
            }
        }

        if (currentNode === null) {
            break; // No reachable nodes left
        }

        unvisitedNodes.delete(currentNode);

        for (const neighbor in graph[currentNode]) {
            const tentativeDistance = distances[currentNode] + graph[currentNode][neighbor];
            if (tentativeDistance < distances[neighbor]) {
                distances[neighbor] = tentativeDistance;
                previousNodes[neighbor] = currentNode;
            }
        }
    }

    return {
        distances,
        previousNodes
    };
};

const readGraphFromCSV = async (filename: string): Promise<Graph> => {
    const graph: Graph = {};
    const parser = fs.createReadStream(filename).pipe(parse({ columns: true, skip_empty_lines: true }));

    for await (const record of parser) {
        const source = record.source;
        const target = record.target;
        const weight = parseFloat(record.weight);

        if (!graph[source]) {
            graph[source] = {};
        }
        graph[source][target] = weight;

        if (!graph[target]) {
            graph[target] = {};
        }
        graph[target][source] = weight; // For undirected graph
    }

    return graph;
};

const main = async () => {
    const directoryPath = "./data/dijkstra";
    const filenames = fs.readdirSync(directoryPath).filter(file => file.endsWith(".csv"));

    filenames.forEach(async (filename) => {
        try {
            const filePath = path.join(directoryPath, filename);
            const graph = await readGraphFromCSV(filePath);

            const startNode = Object.keys(graph)[0];
            const { distances, previousNodes } = dijkstra(graph, startNode);
            console.log(`Shortest distances from node ${startNode}:`);
            for (const node in distances) {
                console.log(`To node ${node}: ${distances[node]}`);
            }
            console.log("\n")

        } catch (error) {
            console.error("Error reading graph data or running Dijkstra's algorithm:", error);
        }
    })
};

main();