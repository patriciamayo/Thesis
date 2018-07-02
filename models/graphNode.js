class GraphNode {
    constructor(id, label, description, group, position) {
      this.id = id;
      this.label = label;
      this.description = description;
      this.group = group;
      this.position = position;
    }
}
  
module.exports = GraphNode;