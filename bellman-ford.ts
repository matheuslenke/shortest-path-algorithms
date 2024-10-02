import { createCanvas } from 'canvas';
import { parse } from 'csv-parse';
import fs, { writeFileSync } from 'fs';
import path from 'path';

interface Graph {
    [node: string]: { [neighbor: string]: number };
}

const bellmanFord = (graph: Graph, startNode: string): { distances: { [node: string]: number }, previousNodes: { [node: string]: string | null }, hasNegativeCycle: boolean } => {
    const distances: { [node: string]: number } = {};
    const previousNodes: { [node: string]: string | null } = {};

    // Initialize distances
    for (const node in graph) {
        distances[node] = Infinity;
    }
    distances[startNode] = 0;

    // Relax edges repeatedly
    const numNodes = Object.keys(graph).length;
    for (let i = 0; i < numNodes - 1; i++) {
        for (const source in graph) {
            for (const target in graph[source]) {
                const weight = graph[source][target];
                const newDistance = distances[source] + weight;
                if (newDistance < distances[target]) {
                    distances[target] = newDistance;
                    previousNodes[target] = source;
                }
            }
        }
    }

    // Check for negative cycles
    let hasNegativeCycle = false;
    for (const source in graph) {
        for (const target in graph[source]) {
            const weight = graph[source][target];
            if (distances[source] + weight < distances[target]) {
                hasNegativeCycle = true;
                break;
            }
        }
        if (hasNegativeCycle) {
            break;
        }
    }

    return { distances, previousNodes, hasNegativeCycle };
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
    }

    return graph;
};

const renderGraph = (graph: Graph, outputFilename: string) => {
    const canvasWidth = 800;
    const canvasHeight = 600;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Set up some basic styles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.font = '12px Arial';

    // Calculate positions for each node
    const nodes = Object.keys(graph);
    const nodePositions: { [node: string]: { x: number, y: number } } = {};
    const radius = 200;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    nodes.forEach((node, index) => {
        const angle = (index / nodes.length) * 2 * Math.PI;
        nodePositions[node] = {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    });

    // Draw edges
    for (const source in graph) {
        for (const target in graph[source]) {
            const { x: x1, y: y1 } = nodePositions[source];
            const { x: x2, y: y2 } = nodePositions[target];
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Draw weight
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            ctx.fillStyle = 'red';
            ctx.fillText(graph[source][target].toString(), midX, midY);
            ctx.fillStyle = 'black';
        }
    }

    // Draw nodes
    nodes.forEach(node => {
        const { x, y } = nodePositions[node];
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = 'lightblue';
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText(node, x - 5, y + 5);
    });

    // Save to file
    const buffer = canvas.toBuffer('image/png');
    writeFileSync(outputFilename, buffer);
};

const main = async () => {
    const directoryPath = "./data/bellman-ford";
    const filenames = fs.readdirSync(directoryPath).filter(file => file.endsWith(".csv"));

    filenames.forEach(async (filename) => {
        try {
            const filePath = path.join(directoryPath, filename);
            const graph = await readGraphFromCSV(filePath);
            const startNode = Object.keys(graph)[0];
            renderGraph(graph, path.join(directoryPath, `output_${startNode}.png`))

            const startTime = Date.now();
            const { distances, previousNodes } = bellmanFord(graph, startNode);
            const endTime = Date.now();
            const executionTime = endTime - startTime;
            console.log(`Execution time for Bellman-Ford algorithm: ${executionTime} ms`);

            // console.log(`Shortest distances from node ${startNode}:`);
            // for (const node in distances) {
            //     console.log(`To node ${node}: ${distances[node]}; previous: ${previousNodes[node]}`);
            // }
            // console.log("\n")

        } catch (error) {
            console.error("Error reading graph data or running Dijkstra's algorithm:", error);
        }
    })
};

main();