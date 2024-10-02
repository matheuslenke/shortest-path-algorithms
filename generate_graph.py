import csv
import random

def generate_graph_csv(num_nodes=1000, edge_probability=0.9, negative_weight_probability=0, filename="large_graph_positive_large.csv"):
  """
  Generates a CSV file representing a graph with a specified number of nodes and edges.

  Args:
    num_nodes: The number of nodes in the graph.
    edge_probability: The probability of an edge existing between any two nodes.
    negative_weight_probability: The probability of an edge having a negative weight.
    filename: The name of the CSV file to generate.
  """

  with open(filename, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["source", "target", "weight"])  # Header row

    for i in range(num_nodes):
      for j in range(i + 1, num_nodes):
        if random.random() < edge_probability:
          weight = random.randint(1, 10)  # Random weight between 1 and 10
          if random.random() < negative_weight_probability:
            weight = -weight  # Make weight negative with some probability
          writer.writerow([f"Node{i}", f"Node{j}", weight])

if __name__ == "__main__":
  generate_graph_csv()