import fs from 'fs';

// Generate a random graph
function generateGraph() {
    const numNodes = Math.floor(Math.random() * 10) + 1; // Random number of nodes between 1 and 10
    const edges = [];

    // Generate random edges with weights
    for (let i = 1; i <= numNodes; i++) {
        for (let j = i + 1; j <= numNodes; j++) {
            const weight = Math.floor(Math.random() * 10) + 1; // Random weight between 1 and 10
            edges.push([i, j, weight]);
        }
    }

    return edges;
}

// Save graph to CSV file
function saveGraphToCSV(graph: number[][], file: string) {
    const csvData = graph.map(edge => edge.join(',')).join('\n');
    fs.writeFileSync(file, csvData);
}

// Generate and save the graph
for (let i = 1; i <= 100; i++) {
    const graph = generateGraph();
    saveGraphToCSV(graph, `./data/graph${i}.csv`);
}