interface Edge {
    source: number;
    destination: number;
    weight: number;
}

class Graph {
    vertices: number;
    edges: Edge[];

    constructor(vertices: number) {
        this.vertices = vertices;
        this.edges = [];
    }

    addEdge(source: number, destination: number, weight: number) {
        this.edges.push({ source, destination, weight });
    }

    bellmanFord(startVertex: number): number[] {
        const distances = Array(this.vertices).fill(Infinity);
        distances[startVertex] = 0;

        for (let i = 1; i < this.vertices; i++) {
            for (const edge of this.edges) {
                const { source, destination, weight } = edge;
                if (distances[source] !== Infinity && distances[source] + weight < distances[destination]) {
                    distances[destination] = distances[source] + weight;
                }
            }
        }

        for (const edge of this.edges) {
            const { source, destination, weight } = edge;
            if (distances[source] !== Infinity && distances[source] + weight < distances[destination]) {
                throw new Error("Graph contains a negative-weight cycle");
            }
        }

        return distances;
    }
}

// Example usage:
const graph = new Graph(5);
graph.addEdge(0, 1, -1);
graph.addEdge(0, 2, 4);
graph.addEdge(1, 2, 3);
graph.addEdge(1, 3, 2);
graph.addEdge(1, 4, 2);
graph.addEdge(3, 2, 5);
graph.addEdge(3, 1, 1);
graph.addEdge(4, 3, -3);

try {
    const distances = graph.bellmanFord(0);
    console.log(distances);
} catch (error) {
    console.error(error);
}