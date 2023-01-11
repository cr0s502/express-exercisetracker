class User {

  constructor(username, _id) {
    this.username = username;
    this._id = _id;
    this.exercises = []
  }

  addExercise = (item) => {
    this.exercises.push(item)
  }

  get Execises() {
    return this.exercises
  }

  get Username() {
    return this.username
  }

  get Id() {
    return this._id
  }
}

module.exports = User