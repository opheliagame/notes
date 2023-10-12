class CSSGrid {
  constructor(qtree, width, height) {
    this.qtree = qtree
    this.width = width
    this.height = height

    this.rows = this.findRows()
    this.cols = this.findCols()

    this.template = new Array(this.cols).fill(0).map(a => new Array(this.rows).fill(0))
    this.gridIDs = []
  }

  findRows() {
    let rowHeight = this.qtree.getSmallestQuad().boundary.h*2
    this.cellh = rowHeight/2
    return this.height/rowHeight
  }

  findCols() {
    let colWidth = this.qtree.getSmallestQuad().boundary.w*2
    this.cellw = colWidth/2
    return this.width/colWidth
  }

  buildCSSTemplate() {
    console.log('inside gridjs func')
    // if(this.gridIDs.length > 0) return

    let chars = "abcdefghijklmnopqrstuvwxyz"
    this.gridIDs = new Array(this.nCells).fill(0).map((e, i) => chars[i])
    // let template = {}
    // leafNodes.forEach((e, i) => {
      //   let letter = chars[i]
      //   template[letter] = Math.pow(e.boundary.w/this.cellw, 2)
      // });
      
      
      this.leafNodes.forEach((c, i) => {
        c.getCSSTemplate(this, this.gridIDs[i])
      })
      console.log(this.gridIDs)
    }

  getGridAreaString() {
    this.leafNodes = this.qtree.getLeafNodes()
    this.nCells = this.leafNodes.length
    this.buildCSSTemplate()
    return this.template.map(l => `'${l.join(' ')}'`).join(' ')
  }

}

// exports.CSSGrid = CSSGrid