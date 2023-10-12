class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  contains(point) {
    return (
      point.x >= this.x - this.w 
      && point.x <= this.x + this.w 
      && point.y >= this.y - this.h 
      && point.y <= this.x + this.y )
  }
}

class QuadTree{
  constructor(boundary, capacity) {
    this.boundary = boundary
    this.capacity = capacity
    this.points = []
    this.divided = false
    this.leafnodes = []
  }

  subdivide() {
    let x = this.boundary.x
    let y = this.boundary.y
    let w = this.boundary.w
    let h = this.boundary.h
    let tl = new Rectangle(x - w/2, y - h/2, w/2, h/2)
    this.topleft = new QuadTree(tl, this.capacity)
    let tr = new Rectangle(x + w/2, y - h/2, w/2, h/2)
    this.topright = new QuadTree(tr, this.capacity)
    let bl = new Rectangle(x - w/2, y + h/2, w/2, h/2)
    this.bottomleft = new QuadTree(bl, this.capacity)
    let br = new Rectangle(x + w/2, y + h/2, w/2, h/2)
    this.bottomright = new QuadTree(br, this.capacity)
    this.children = [this.topleft, this.topright, this.bottomleft, this.bottomright]
    this.divided = true
  }

  insert(point) {

    if(!this.boundary.contains(point)) return false

    if(this.points.length < this.capacity) {
      this.points.push(point)
      return true
    } else {
      if(!this.divided) {
        this.subdivide()
      }

      if(this.topleft.insert(point)) return true
      if(this.topright.insert(point)) return true
      if(this.bottomleft.insert(point)) return true
      if(this.bottomright.insert(point)) return true
    }
  }

  getSmallestQuad() {
    if(!this.children) {
      return this
    }

    let options = this.children.map(c => c.getSmallestQuad())
    let widths = options.map(c => c.boundary.w)

    let smallest = Math.min(...widths)
    this.smallestQuad = options.filter(c => c.boundary.w ===  smallest)[0]
    return this.smallestQuad
  }

  getLeafNodes() {
    if(!this.children) return []

    let leafnodes = []
    this.children.forEach(c => {
      if(!c.children) leafnodes.push(c)
      let childLeaves = c.getLeafNodes()
      leafnodes.push(...childLeaves)
    })

    return leafnodes
  }

  getCSSTemplate(grid, alpha) {
    let root = grid.qtree
    let edge = grid.cellw
    let n = grid.rows
    let template = grid.template
    if(!this.children) {
      let x1 = root.boundary.w*2
      let x2 = (this.boundary.x - this.boundary.w)
      let xindex = Math.floor(n - (x1-x2)/(edge*2) )
                    
      let y1 = root.boundary.h*2
      let y2 = (this.boundary.y - this.boundary.h)
      let yindex = Math.floor(n - (y1-y2)/(edge*2) )
                  
      let span = this.boundary.w/edge - 1
      for(let i = 0; i <= span; i++) {
        for(let j = 0; j <= span; j++) {
          template[xindex+i][yindex+j] = alpha
        }
      }
      return
    }

    // return this.children.forEach(c => c.getCSSTemplate(root, edge, n, template, alpha))

  }
}

// exports.QuadTree = QuadTree
// exports.Rectangle = Rectangle
// exports.Point = Point