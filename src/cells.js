class Cell {

  constructor(cell) {
    this.bomb = cell.bomb
    this.number = cell.number
    this.location = cell.location
    this.flag = false
  }

  display() {
    if (this.bomb) {
      return "💣"
    } else if (this.number === 0) {
      return "&nbsp"
    } else {
      return this.number
    }
  }

  appendCell() {
    let td = document.getElementById(`${this.location}`)
    td.innerHTML = this.display()
    if (td.className === "") {
      unclicked -= 1
    }
    if (this.bomb) {
      td.className = 'bomb'
      Cell.lose()
    } else {
      td.className = 'clicked'
      if (this.number === 1) td.className = "one"
      if (this.number === 2) td.className = "two"
      if (this.number === 3) td.className = "three"
      if (this.number === 4) td.className = "four"
      if (this.number === 5) td.className = "five"
      if (this.number === 6) td.className = "six"
      if (this.number === 7) td.className = "seven"
      if (this.number === 8) td.className = "eight"
    }
    Cell.gameEnd()
  }

  static fetchCell(location) {
    fetch(`https://kevins-minesweeper-api.herokuapp.com/cells/${location}`)
      .then(jsonToJS)
      .then(this.appendCells)
  }

  static appendCells(cells) {
    let newCell;
    if (Array.isArray(cells)) {
      for (const cell of cells) {
        newCell = new Cell(cell)
        newCell.appendCell()
      }
    } else {
      newCell = new Cell(cells)
      newCell.appendCell()
    }
  }

  static search(e) {
    if (e.target.className == "") {
      Cell.fetchCell(e.target.id)
    }
  }

  static newGame() {
    fetch('https://kevins-minesweeper-api.herokuapp.com/cells', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }})
    .then(() => {
      Cell.setupGame()
      console.log("finish setup");
      hideLoad()
    })
    console.log("start setup");
    showLoad()
  }

  static setupGame() {
    clearInterval(gameTimer)
    startTimer()
    timer.innerText = "00:00"
    unclicked = 100
    flagButton.innerText = "🚩 : 15"
    for (const td of tds) {
      td.innerHTML = "&nbsp;"
      td.className = ""
    }
  }

  static toggleFlag() {
    if (flagButton.className === "btn draw-border") {
      flagButton.className = "flag-btn draw-flag-border"
      for (const td of tds) {
        td.removeEventListener('click', Cell.search)
        td.addEventListener('click', Cell.addFlag)
      }
    } else if (flagButton.className === "flag-btn draw-flag-border") {
      flagButton.className = "btn draw-border"
      for (const td of tds) {
        td.removeEventListener('click', Cell.addFlag)
        td.addEventListener('click', Cell.search)
      }
    }
  }

  static addFlag(e) {
    if (e.target.tagName == "TD") {
      if (e.target.className === "flag") {
        e.target.innerHTML = "&nbsp;"
        e.target.className = ""
        let flags = parseInt(flagButton.innerText.split(":")[1])
        flags += 1
        flagButton.innerText = `🚩 : ${flags}`
      } else if (e.target.className === "") {
        let flags = parseInt(flagButton.innerText.split(":")[1])
        if (flags > 0) {
          flags -= 1
          flagButton.innerText = `🚩 : ${flags}`
          e.target.innerText = "🚩"
          e.target.className = "flag"
          Cell.gameEnd()
        }
      }
    }
  }

  static gameEnd() {
    if (flagButton.innerText === "🚩 : 0") {
      if (m.length === 0) {
        fetch("https://kevins-minesweeper-api.herokuapp.com/cells")
        .then(jsonToJS)
        .then(Cell.checkFlags)
      } else {
        Cell.checkFlags(m)
      }
    } else if (unclicked === 15) {
      Cell.win()
    }
  }

  static win() {
    clearInterval(gameTimer)
    let score = timer.innerText
    let user = prompt("Enter your name for the Leaderboards:")
    if (user === null || user === "") {
      swal({title: "Score Not Saved =(", icon: "error", button: "Too Bad"})
    } else {
      fetch("https://kevins-minesweeper-api.herokuapp.com/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({"user": user, "score": score})
      }).then(getLeaderboard)
    }
  }

  static lose() {
    clearInterval(gameTimer)
    swal({title: "Game Over", icon: "error", button: "Shucks"})
    .then(Cell.newGame)
  }

  static checkFlags(mines) {
    m = mines
    for (const mine of mines) {
      let bomb = new Cell(mine)
      let cell = document.getElementById(`${bomb.location}`)
      if (cell.className === "flag") {

      } else {
        return
      }
    }
    Cell.win()
  }

}
