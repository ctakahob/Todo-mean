const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  _idList: Schema.Types.ObjectId,
  title: {type: String, required: true},
  completed: {type: Boolean,default: false}
})

module.exports = model('Todo', schema)
